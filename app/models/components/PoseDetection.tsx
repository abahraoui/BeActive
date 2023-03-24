import React, { useEffect, useState, useRef } from "react"
import { StyleSheet, View, Dimensions, Platform } from "react-native"
import { Text } from "../../components/Text"
import { Camera } from "expo-camera"

import * as tf from "@tensorflow/tfjs"
import * as posedetection from "@tensorflow-models/pose-detection"
import * as ScreenOrientation from "expo-screen-orientation"
import { bundleResourceIO, cameraWithTensors } from "@tensorflow/tfjs-react-native"
import Svg, { Circle } from "react-native-svg"
import { ExpoWebGLRenderingContext } from "expo-gl"
import { CameraType } from "expo-camera/build/Camera.types"
import { PushUp } from "./PushUp"
import CountDownTimer from "./Timer"
import { Squat } from "./Squat"

//Thanks to
//       Shanqing Cai
//       Nick Kreeger
//       Stanley Bileschi
//       Yannick Assogba
//       Daniel Smilkov
//       Nikhil Thorat
//       Clément Beauseigneur
//       Jing Jin
//       David Soergel
//       Ping Yu
//       Kangyi Zhang
//       Jen Person
//       Na Li
//       Marianne Linhares Monteiro
// that have contributed to this project from TensorFlow: https://github.com/tensorflow/tfjs-models/tree/master/pose-detection

// tslint:disable-next-line: variable-name
const TensorCamera = cameraWithTensors(Camera)

const IS_ANDROID = Platform.OS === "android"
const IS_IOS = Platform.OS === "ios"

// Camera preview size.
//
// From experiments, to render camera feed without distortion, 16:9 ratio
// should be used fo iOS devices and 4:3 ratio should be used for android
// devices.
//
// This might not cover all cases.
const CAM_PREVIEW_WIDTH = Dimensions.get("window").width
const ASPECT_RATIO = IS_IOS ? 9 / 16 : 3 / 4
const CAM_PREVIEW_HEIGHT = CAM_PREVIEW_WIDTH / ASPECT_RATIO

// The score threshold for pose detection results.
const MIN_KEYPOINT_SCORE = 0.3

// The size of the resized output from TensorCamera.
//
// For movenet, the size here doesn't matter too much because the model will
// preprocess the input (crop, resize, etc). For best result, use the size that
// doesn't distort the image.
const OUTPUT_TENSOR_WIDTH = 180
const OUTPUT_TENSOR_HEIGHT = OUTPUT_TENSOR_WIDTH / ASPECT_RATIO

// Whether to auto-render TensorCamera preview.
const AUTO_RENDER = true

// Whether to load model from app bundle (true) or through network (false).
const LOAD_MODEL_FROM_BUNDLE = true

interface PoseDetectionProps {
  exerciseType: string
  onComplete: () => void
  duration: number
}

export const PoseDetection: React.FC<PoseDetectionProps> = (props) => {
  const cameraRef = useRef(null)
  const [tfReady, setTfReady] = useState(false)
  const [model, setModel] = useState<posedetection.PoseDetector>()
  const [poses, setPoses] = useState<posedetection.Pose[]>()
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation>()
  const [cameraType, setCameraType] = useState<CameraType>(CameraType.front)
  // Use `useRef` so that changing it won't trigger a re-render.
  //
  // - null: unset (initial value).
  // - 0: animation frame/loop has been canceled.
  // - >0: animation frame has been scheduled.
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    async function prepare() {
      rafId.current = null
      console.log(props.exerciseType)

      // Set initial orientation.
      const curOrientation = await ScreenOrientation.getOrientationAsync()
      setOrientation(curOrientation)

      // Listens to orientation change.
      ScreenOrientation.addOrientationChangeListener((event) => {
        setOrientation(event.orientationInfo.orientation)
      })

      // Camera permission.
      await Camera.requestCameraPermissionsAsync()

      // Wait for tfjs to initialize the backend.
      await tf.ready()

      // Load movenet model.
      // https://github.com/tensorflow/tfjs-models/tree/master/pose-detection
      const movenetModelConfig: posedetection.MoveNetModelConfig = {
        modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true,
      }
      if (LOAD_MODEL_FROM_BUNDLE) {
        let modelJson: any = ""
        let modelWeights1: any = ""
        let modelWeights2: any = ""
        switch (props.exerciseType) {
          case "push-ups":
            modelJson = require("./ml_model/push-ups_model.json")
            modelWeights1 = require("./ml_model/push-ups_weights1of2.bin")
            modelWeights2 = require("./ml_model/push-ups_weights2of2.bin")
            break
          case "squats":
            modelJson = require("./ml_model/squats_model.json")
            modelWeights1 = require("./ml_model/squats_weights1of2.bin")
            modelWeights2 = require("./ml_model/squats_weights2of2.bin")
            break
          default:
            modelJson = require("./ml_model/push-ups_model.json")
            modelWeights1 = require("./ml_model/push-ups_weights1of2.bin")
            modelWeights2 = require("./ml_model/push-ups_weights2of2.bin")
        }

        movenetModelConfig.modelUrl = bundleResourceIO(modelJson, [modelWeights1, modelWeights2])
      }
      const model = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        movenetModelConfig,
      )
      setModel(model)

      // Ready!
      setTfReady(true)
    }

    prepare()
  }, [props.exerciseType])

  useEffect(() => {
    // Called when the app is unmounted.
    return () => {
      if (rafId.current != null && rafId.current !== 0) {
        cancelAnimationFrame(rafId.current)
        rafId.current = 0
      }
    }
  }, [])

  const handleCameraStream = async (
    images: IterableIterator<tf.Tensor3D>,
    updatePreview: () => void,
    gl: ExpoWebGLRenderingContext,
  ) => {
    const loop = async () => {
      // Get the tensor and run pose detection.
      const imageTensor = images.next().value as tf.Tensor3D

      const poses = await model!.estimatePoses(imageTensor, undefined, Date.now())
      setPoses(poses)
      tf.dispose([imageTensor])

      if (rafId.current === 0) {
        return
      }

      // Render camera preview manually when autorender=false.
      if (!AUTO_RENDER) {
        updatePreview()
        gl.endFrameEXP()
      }

      rafId.current = requestAnimationFrame(loop)
    }

    loop()
  }

  const renderPose = () => {
    if (poses != null && poses.length > 0) {
      const keypoints = poses[0].keypoints
        .filter((k) => (k.score ?? 0) > MIN_KEYPOINT_SCORE)
        .map((k) => {
          // Flip horizontally on android or when using back camera on iOS.
          const flipX = IS_ANDROID || cameraType === CameraType.back
          const x = flipX ? getOutputTensorWidth() - k.x : k.x
          const y = k.y
          const cx =
            (x / getOutputTensorWidth()) * (isPortrait() ? CAM_PREVIEW_WIDTH : CAM_PREVIEW_HEIGHT)
          const cy =
            (y / getOutputTensorHeight()) * (isPortrait() ? CAM_PREVIEW_HEIGHT : CAM_PREVIEW_WIDTH)
          return (
            <Circle
              key={`skeletonkp_${k.name}`}
              cx={cx}
              cy={cy}
              r="4"
              strokeWidth="2"
              fill="#00AA00"
              stroke="white"
            />
          )
        })

      return <Svg style={styles.svg}>{keypoints}</Svg>
    } else {
      return <View></View>
    }
  }

  const renderCameraTypeSwitcher = () => {
    return (
      <View style={styles.cameraTypeSwitcher} onTouchEnd={handleSwitchCameraType}>
        <Text>Switch to {cameraType === CameraType.front ? "back" : "front"} camera</Text>
      </View>
    )
  }

  const handleSwitchCameraType = () => {
    if (cameraType === CameraType.front) {
      setCameraType(CameraType.back)
    } else {
      setCameraType(CameraType.front)
    }
  }

  const isPortrait = () => {
    return (
      orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
      orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
    )
  }

  const getOutputTensorWidth = () => {
    // On iOS landscape mode, switch width and height of the output tensor to
    // get better result. Without this, the image stored in the output tensor
    // would be stretched too much.
    //
    // Same for getOutputTensorHeight below.
    return isPortrait() || IS_ANDROID ? OUTPUT_TENSOR_WIDTH : OUTPUT_TENSOR_HEIGHT
  }

  const getOutputTensorHeight = () => {
    return isPortrait() || IS_ANDROID ? OUTPUT_TENSOR_HEIGHT : OUTPUT_TENSOR_WIDTH
  }

  const getTextureRotationAngleInDegrees = () => {
    // On Android, the camera texture will rotate behind the scene as the phone
    // changes orientation, so we don't need to rotate it in TensorCamera.
    if (IS_ANDROID) {
      return 0
    }

    // For iOS, the camera texture won't rotate automatically. Calculate the
    // rotation angles here which will be passed to TensorCamera to rotate it
    // internally.
    switch (orientation) {
      // Not supported on iOS as of 11/2021, but add it here just in case.
      case ScreenOrientation.Orientation.PORTRAIT_DOWN:
        return 180
      case ScreenOrientation.Orientation.LANDSCAPE_LEFT:
        return cameraType === CameraType.front ? 270 : 90
      case ScreenOrientation.Orientation.LANDSCAPE_RIGHT:
        return cameraType === CameraType.front ? 90 : 270
      default:
        return 0
    }
  }

  function exerciseFinished() {
    console.log("🚀 exerciseFinished")
    if (typeof props?.onComplete === "function") props.onComplete()
  }
  function startExercise() {
    switch (props.exerciseType) {
      case "push-ups":
        return <PushUp poses={poses ?? []} />

      case "squats":
        return <Squat poses={poses ?? []} />

      default:
        return <Text>ERROR: No exercise selected</Text>
    }
  }

  if (!tfReady) {
    return (
      <View style={styles.loadingMsg}>
        <Text>Loading...</Text>
      </View>
    )
  } else {
    return (
      // Note that you don't need to specify `cameraTextureWidth` and
      // `cameraTextureHeight` prop in `TensorCamera` below.
      <View style={isPortrait() ? styles.containerPortrait : styles.containerLandscape}>
        <TensorCamera
          ref={cameraRef}
          style={styles.camera}
          autorender={AUTO_RENDER}
          type={cameraType}
          // tensor related props
          resizeWidth={getOutputTensorWidth()}
          resizeHeight={getOutputTensorHeight()}
          resizeDepth={3}
          rotation={getTextureRotationAngleInDegrees()}
          onReady={handleCameraStream}
          useCustomShadersToResize={false}
          cameraTextureWidth={0}
          cameraTextureHeight={0}
        />

        {startExercise()}

        {renderCameraTypeSwitcher()}

        <CountDownTimer
          style={styles.timerStyle}
          duration={props.duration}
          onComplete={() => exerciseFinished()}
          preset="subheading"
          size="xxl"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  camera: {
    height: "100%",
    width: "100%",
    zIndex: 1,
  },
  // eslint-disable-next-line react-native/no-color-literals
  cameraTypeSwitcher: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .7)",
    borderRadius: 2,
    padding: 8,
    position: "absolute",
    right: 10,
    top: 10,
    width: 180,
    zIndex: 40,
  },
  containerLandscape: {
    height: CAM_PREVIEW_WIDTH,
    marginLeft: Dimensions.get("window").height / 2 - CAM_PREVIEW_HEIGHT / 2,
    position: "relative",
    width: CAM_PREVIEW_HEIGHT,
  },
  containerPortrait: {
    // height: CAM_PREVIEW_HEIGHT,
    aspectRatio: ASPECT_RATIO,
    // marginTop: spacing.medium,
    // position: "relative",
    // width: CAM_PREVIEW_WIDTH,
  },
  loadingMsg: {
    alignItems: "center",
    // height: "100%",
    justifyContent: "center",
    // position: "absolute",
    // width: "100%",
  },
  svg: {
    height: "100%",
    position: "absolute",
    width: "100%",
    zIndex: 30,
  },
  timerStyle: { textAlign: "center" },
})

export default PoseDetection

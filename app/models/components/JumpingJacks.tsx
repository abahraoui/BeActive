import React, { useState, FC, useLayoutEffect } from "react"
import { View, ViewStyle } from "react-native"
import { Accelerometer } from "expo-sensors"
import Timer from "./Timer"
import { Subscription } from "expo-sensors/build/Pedometer"
import { Text } from "../../components"
import { Audio } from "expo-av"
import { observer } from "mobx-react-lite"
import { useStores } from "../helpers/useStores"

const bellSound = require("../../../assets/sounds/bell.wav")

interface JumpingJacksProps {
  duration: number
  onComplete: () => void
}

export const JumpingJacks: FC<JumpingJacksProps> = observer(function (props) {
  const {
    exerciseTrackerStore: { incrementCurrentCount, currentCount },
  } = useStores()
  const [subscription, setSubscription] = useState<Subscription>(null)
  const [sound, setSound] = React.useState<Audio.Sound>()
  const [speed, setSpeed] = React.useState<number>(-1)
//   const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 })

  const _subscribe = () => {
    // basically react native shake but I needed control of the shakethreshold

    let previousX: number, previousY: number, previousZ: number
    let previousUpdate = 0
    const shakeThreshold = 360
    // let count = 0

    setSubscription(
      Accelerometer.addListener(function (data) {
        const { x, y, z } = data

        const currentTime = Date.now()
        if (currentTime - previousUpdate > 100) {
          const difference = currentTime - previousUpdate
          previousUpdate = currentTime
          const speed =
            (Math.abs(x + y + z - previousX - previousY - previousZ) / difference) * 10000
          setSpeed(speed)
          if (speed > shakeThreshold) {
			incrementCurrentCount()
            console.log("new currentCount", currentCount)
            playSound()
          }
          previousX = x
          previousY = y
          previousZ = z
        }
      }),
    )
  }

  const _unsubscribe = () => {
    subscription && subscription.remove()
    setSubscription(null)
    console.log("🚀 _unsubscribe")
  }

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(bellSound)
    setSound(sound)
    console.log("🚀 playSound")
    await sound.playAsync()
  }

  useLayoutEffect(() => {
    _subscribe()
    return () => _unsubscribe()
  }, [])

  useLayoutEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  function exerciseFinished() {
    console.log("🚀 exerciseFinished")
    if (typeof props?.onComplete === "function") props.onComplete()
    _unsubscribe()
  }

  return (
    <View style={container}>
      <Timer
        duration={props.duration}
        onComplete={() => exerciseFinished()}
        preset="subheading"
        size="xxl"
      />
      <Text text={`speed: ${speed}`} preset="bold" />
      <Text text={`Jumping jacks: ${currentCount}`} preset="bold" />
    </View>
  )
})

const container: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

export default JumpingJacks

import React, { FC, useLayoutEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, Image, ViewStyle, ImageStyle, TextStyle } from "react-native"
import { AppStackScreenProps } from "../navigators"
import { Button, Text, Screen } from "../components"
import { spacing } from "../theme"
import { ExerciseTrackingState, useStores } from "../models"
import JumpingJacks from "../models/components/JumpingJacks"
import PoseDetection from "../models/components/PoseDetection"
import RussianTwists from "../models/components/RussianTwists"

const images = {
  "jumping-jacks": require(`../../assets/images/jumping-jacks.png`),
  "push-ups": require(`../../assets/images/pushups.jpg`),
  "russian-twists": require(`../../assets/images/russian-twist.jpg`),
  squats: require(`../../assets/images/squat.jpg`),
}

interface ExerciseTrackerScreenProps extends AppStackScreenProps<"ExerciseTracker"> {}

export const ExerciseTrackerScreen: FC<ExerciseTrackerScreenProps> = observer(
  function ExerciseTrackerScreen(_props) {
    const {
      exerciseTrackerStore,
      profileStore: { addScore },
    } = useStores()
    const { navigation } = _props

    const exercise = exerciseTrackerStore.currentExercise

    useLayoutEffect(() => {
      exerciseTrackerStore.setProp("state", ExerciseTrackingState.NOT_STARTED)
      exerciseTrackerStore.resetCurrentCount()
    }, [])

    function startExercise() {
      console.log("start")
      exerciseTrackerStore.setProp("state", ExerciseTrackingState.RUNNING)
    }

    function submitExercise() {
      console.log("submit")
      addScore(exerciseTrackerStore.currentCount, exercise.id, new Date())
      navigation.push("SocialFeed")
    }

    const imgSrc = images[exercise.id]

    function exerciseComponent() {
      switch (exercise.id) {
        case "jumping-jacks":
          return (
            <JumpingJacks
              key={exercise.id}
              duration={60}
              onComplete={() => {
                alert(
                  "Exercise complete, you did " +
                    exerciseTrackerStore.currentCount +
                    " jumping jacks!",
                )
                exerciseTrackerStore.setProp("state", ExerciseTrackingState.ENDED)
              }}
            />
          )
        case "russian-twists":
            return (
              <RussianTwists
                key={exercise.id}
                duration={60}
                onComplete={() => {
                  alert(
                    "Exercise complete, you did " +
                      exerciseTrackerStore.currentCount +
                      " russian twists!",
                  )
                  exerciseTrackerStore.setProp("state", ExerciseTrackingState.ENDED)
                }}
              />
            )
        case "push-ups":
        case "squats":
          // eslint-disable-next-line no-case-declarations
          const exerciseName = exercise.id === "push-ups" ? "push ups" : "squats"
          return (
            <PoseDetection
              onComplete={() => {
                alert(
                  `Exercise complete, you did ${exerciseTrackerStore.currentCount} ${exerciseName}!`,
                )
                exerciseTrackerStore.setProp("state", ExerciseTrackingState.ENDED)
              }}
              duration={60}
              exerciseType={exercise.id}
            />
          )
        default:
          return <Text text={"Unknown workout"} />
      }
    }

    const hideImage =
      ["push-ups", "squats"].includes(exercise.id) &&
      exerciseTrackerStore.state === ExerciseTrackingState.RUNNING

    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={container}>
        <View style={topContainer}>
          {!exercise ? (
            <Text text={"Failed to load exercise!"} />
          ) : (
            <>
              <Text
                testID="welcome-heading"
                tx="exerciseTrackerScreen.todaysExerciseIs"
                preset="subheading"
              />
              <Text testID="exercise-name" text={exercise.name} preset="heading" />
              <Text testID="exercise-desc" text={exercise.description} />
              {/* <Text testID="exercise-count" text={`Count: ${exercise.count}`} style={resultText} /> */}
              {/* <Text
                testID="exercise-name"
                text={`Count from store: ${exerciseTrackerStore.currentCount}`}
              /> */}
              {!hideImage && <Image style={exerciseImage} source={imgSrc} resizeMode="contain" />}
              {exerciseTrackerStore.state === ExerciseTrackingState.NOT_STARTED ? (
                <Button
                  testID="exercise-screen-button"
                  preset="filled"
                  tx="exerciseTrackerScreen.startExercise"
                  onPress={startExercise}
                />
              ) : exerciseTrackerStore.state === ExerciseTrackingState.RUNNING ? (
                exerciseComponent()
              ) : (
                <View style={bottomContainer}>
                  <Text
                    text={`You did ${exerciseTrackerStore.currentCount} repetitions! Good job!`}
                    size="xl"
                    weight="bold"
                    style={resultText}
                  />
                  <Button preset="filled" text="Continue" onPress={submitExercise} />
                </View>
              )}
            </>
          )}
        </View>
      </Screen>
    )
  },
)

const container: ViewStyle = {
  flex: 1,
}
const exerciseImage: ImageStyle = {
  flex: 1,
  height: 88,
  width: "100%",
}
const topContainer: ViewStyle = {
  // flexBasis: "57%",
  flexGrow: 1,
  flexShrink: 1,
  padding: spacing.large,
}
const resultText: TextStyle = {
  textAlign: "center",
  padding: spacing.medium,
}

const bottomContainer: ViewStyle = {}

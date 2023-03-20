import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, Image, ViewStyle, ImageStyle } from "react-native"
import { AppStackScreenProps } from "../navigators"
import { Button, Text, Screen } from "../components"
import { spacing } from "../theme"
import { useStores } from "../models"

const images = {
  "jumping-jacks": require(`../../assets/images/jumping-jacks.png`),
  "push-ups": require(`../../assets/images/pushups.jpg`),
  walking: require(`../../assets/images/walking.jpg`),
}

interface ExerciseTrackerScreenProps extends AppStackScreenProps<"ExerciseTracker"> {}

export const ExerciseTrackerScreen: FC<ExerciseTrackerScreenProps> = observer(
  function ExerciseTrackerScreen(_props) {
    const { exerciseTrackerStore } = useStores()
    const { navigation } = _props

    const exercise = exerciseTrackerStore.currentExercise
    if (!exercise) return <Text text={"asd"} />

    function startExercise() {
      console.log("start")
    }
    const imgSrc = images[exercise.id]

    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={container}>
        <View style={topContainer}>
          <Text
            testID="welcome-heading"
            tx="exerciseTrackerScreen.todaysExerciseIs"
            preset="subheading"
          />
          <Text testID="exercise-name" text={exercise.name} preset="heading" />
          <Text testID="exercise-name" text={exercise.description} />
          <Text testID="exercise-name" text={`Count: ${exercise.count}`} />
          <Image style={exerciseImage} source={imgSrc} resizeMode="contain" />
          <Button
            testID="exercise-screen-button"
            preset="filled"
            tx="exerciseTrackerScreen.startExercise"
            onPress={startExercise}
          />
          <Button text="Go back" onPress={() => navigation.navigate("Welcome")} />
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

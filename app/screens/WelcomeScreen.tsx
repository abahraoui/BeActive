import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Button, Text } from "../components"
import { ExerciseTrackingState, useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { useHeader } from "../utils/useHeader"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(
  _props, // @demo remove-current-line
) {
  // @demo remove-block-start
  const { navigation } = _props
  const {
    profileStore: { logout, name },
    exercises,
    exerciseTrackerStore: { setCurrentExercise, setProp },
  } = useStores()

  function goNext() {
    navigation.navigate("Demo", { screen: "DemoShowroom" })
  }

  useHeader({
    rightTx: "common.logOut",
    onRightPress: logout,
  })
  // @demo remove-block-end
  function goExercise() {
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)]
    setProp("state", ExerciseTrackingState.NOT_STARTED)
    setCurrentExercise(randomExercise)
    navigation.push("ExerciseTracker")
  }

  function sendNotification() {
    console.log("send notif")
  }

  return (
    <View style={$container}>
      <Text
        testID="welcome-heading"
        style={$welcomeHeading}
        text={`Welcome to BeActive, ${name}!`}
        preset="heading"
      />
      <Text
        text="This is the dashboard, you can simulate sending a notification from here."
        size="md"
      />
      {/* @demo remove-block-start */}
      <Button
        style={buttonMargin}
        testID="next-screen-button"
        preset="reversed"
        text={"Go to Demo"}
        onPress={goNext}
      />
      {/* @demo remove-block-end */}
      <Button
        style={buttonMargin}
        testID="exercise-screen-button"
        preset="reversed"
        tx="welcomeScreen.toExercise"
        onPress={goExercise}
      />
      <Button
        style={buttonMargin}
        testID="send-notification-button"
        preset="reversed"
        tx="welcomeScreen.sendNotification"
        onPress={sendNotification}
      />
      <Button
        style={buttonMargin}
        preset="reversed"
        text="Social feed"
        onPress={() => navigation.push("SocialFeed")}
      />
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.large,
}

const $welcomeHeading: TextStyle = {
  marginBottom: spacing.medium,
}
const buttonMargin: ViewStyle = {
  marginTop: spacing.medium,
}

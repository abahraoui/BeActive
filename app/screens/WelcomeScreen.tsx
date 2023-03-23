import { observer } from "mobx-react-lite"
import React, { FC, useEffect } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Button, Text } from "../components"
import { ExerciseTrackingState, useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { useHeader } from "../utils/useHeader"
import { getPushDataObject } from 'native-notify';

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
    loadExercises,
    exerciseById
  } = useStores()

  let pushDataObject = getPushDataObject();
  
  useHeader({
    rightTx: "common.logOut",
    onRightPress: logout,
  })

  React.useLayoutEffect(() => {
    notifactionExercise()
  }, [pushDataObject]);
    
    function notifactionExercise(){
    console.log("pushDataObject", pushDataObject)
    if (pushDataObject.exerciseId){
      const randomExercise = exerciseById(pushDataObject.exerciseId)
      console.log(randomExercise)
      setProp("state", ExerciseTrackingState.NOT_STARTED)
      setCurrentExercise(randomExercise)
      navigation.push("ExerciseTracker")
    }
  }

  // @demo remove-block-end
  function goExercise() {
    loadExercises()
    const randomnum = Math.floor(Math.random() * exercises.length)
    console.log(JSON.stringify(exercises))
    const randomExercise = exercises[randomnum]
    console.log(randomExercise)
    setProp("state", ExerciseTrackingState.NOT_STARTED)
    setCurrentExercise(randomExercise)
    navigation.push("ExerciseTracker")
  }

  async  function sendNotification() {
    console.log("send notif")
    
    loadExercises()
    const randomnum = Math.floor(Math.random() * exercises.length)
    console.log(JSON.stringify(exercises))
    const randomExercise = exercises[randomnum]
    console.log(randomExercise)

    fetch("https://app.nativenotify.com/api/notification", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-GB,en;q=0.9,hu;q=0.8,hu-HU;q=0.7,es-ES;q=0.6,es;q=0.5,en-US;q=0.4",
        "content-type": "application/json;charset=UTF-8",
        "sec-ch-ua": "\"Google Chrome\";v=\"111\", \"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"111\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      "referrer": "https://app.nativenotify.com/in-app",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": JSON.stringify({"appId":"6835","title":"Time for your daily exercise","body":"Today's exercise is "+randomExercise.name.toLowerCase(),"dateSent":"3-23-2023 10:54PM","pushData":JSON.stringify({exerciseId:randomExercise.id}),"bigPictureURL":""}),
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
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

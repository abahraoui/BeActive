import AsyncStorage from "@react-native-async-storage/async-storage"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { spacing } from "../theme"
import { STORAGE_KEYS } from "../utils/constants"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const [nameInput, setNameInput] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const {
    profileStore: { setName },
  } = useStores()

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
  }, [])

  const error = isSubmitted && nameInput.length === 0 ? "Name can't be blank" : ""

  function login() {
    setIsSubmitted(true)

    if (error) return
    console.log("after", error.length)

    // If successful, reset the fields.
    setName(nameInput)
    saveName(nameInput)
    setNameInput("")
    // setIsSubmitted(false)
  }

  async function saveName(name: string) {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE_NAME, name)
  }

  useEffect(() => {
    setIsSubmitted(false)
    return () => {
      setIsSubmitted(false)
      setNameInput("")
    }
  }, [])

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
      style={$container}
    >
      <Text testID="login-heading" tx="loginScreen.signIn" preset="heading" style={$signIn} />
      <Text tx="loginScreen.enterDetails" preset="subheading" style={$enterDetails} />
      <TextField
        value={nameInput}
        onChangeText={setNameInput}
        containerStyle={$textField}
        labelTx="loginScreen.nameFieldLabel"
        placeholderTx="loginScreen.nameFieldPlaceholder"
        helper={error}
        status={error ? "error" : undefined}
      />

      <Button
        testID="login-button"
        tx="loginScreen.tapToSignIn"
        style={$tapButton}
        preset="reversed"
        onPress={login}
      />
    </Screen>
  )
})
const $container: ViewStyle = {
  flex: 1,
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}

const $signIn: TextStyle = {
  marginBottom: spacing.small,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.large,
}

const $textField: ViewStyle = {
  marginBottom: spacing.large,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.extraSmall,
}

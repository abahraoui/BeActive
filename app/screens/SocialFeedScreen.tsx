import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, View, ViewStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { Screen, Text } from "../components"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"
import { spacing } from "../theme"

export const SocialFeedScreen: FC<StackScreenProps<AppStackScreenProps<"SocialFeed">>> = observer(
  function SocialFeedScreen() {
    const rootStore = useStores()
    const lastExercise = rootStore.profileStore.lastScore
    const lastExerciseName = rootStore.exerciseById(lastExercise.exerciseId).name
    const fakeData = [
      {
        name: "John",
        exercise: "Jumping Jacks",
        score: 100,
      },
      {
        name: "Jane",
        exercise: "Push Ups",
        score: 50,
      },
      {
        name: "Joe",
        exercise: "Walking",
        score: 25,
      },
    ]
    // const navigation = useNavigation()
    return (
      <Screen style={$root} preset="scroll">
        <Text text="socialFeed" />
        <View style={resultContainer}>
          <Text text="You" />
          <Text text={lastExerciseName} />
          <Text text={`${lastExercise.score}`} />
        </View>
        <FlatList<typeof fakeData[0]>
          data={fakeData}
          renderItem={({ item }) => (
            <View style={resultContainer}>
              <Text text={item.name} />
              <Text text={item.exercise} />
              <Text text={`${item.score}`} />
            </View>
          )}
          keyExtractor={(item) => item.name}
        />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const resultContainer: ViewStyle = {
  height: spacing.extraLarge,
  padding: spacing.medium,
  justifyContent: "center",
  alignItems: "center",
}

import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import {
  ImageStyle,
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  SectionList,
} from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { AppStackScreenProps } from "../navigators"
import { AutoImage, Card, EmptyState, Screen, Text } from "../components"
// import { useNavigation } from "@react-navigation/native"
import { useStores } from "../models"
import { colors, spacing } from "../theme"
import { api } from "../services/api"

export interface ExerciseResult {
  name: string
  exercise: string
  score: number
  time: Date
  image: string
}

export const SocialFeedScreen: FC<StackScreenProps<AppStackScreenProps<"SocialFeed">>> = observer(
  function SocialFeedScreen() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [socialResults, setSocialResults] = React.useState<ExerciseResult[]>([])
    const rootStore = useStores()
    const lastExercise = rootStore.profileStore.lastScore
    const lastExerciseName = rootStore.exerciseById(lastExercise?.exerciseId)?.name

    React.useEffect(() => {
      ;(async function load() {
        setIsLoading(true)
        setSocialResults(await api.getSocialResults())
        setIsLoading(false)
      })()
    }, [rootStore])
    return (
      <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$root}>
        <SectionList<ExerciseResult>
          sections={socialResults.length > 1 ? [{ data: socialResults }] : []}
          data={socialResults}
          extraData={socialResults.length}
          contentContainerStyle={$flatListContentContainer}
          ListEmptyComponent={
            <View style={{ marginTop: spacing.large }}>
              {isLoading ? (
                <ActivityIndicator size={"large"} />
              ) : (
                <EmptyState
                  heading="No scores yet"
                  content="Your friends haven't completed their activity yet."
                />
              )}
            </View>
          }
          renderSectionHeader={() =>
            lastExercise ? (
              <UserScore
                exercise={lastExerciseName}
                name="You"
                score={lastExercise.score}
                time={lastExercise.time}
                image={"https://via.assets.so/img.jpg?w=150&t=TODO"}
                backgroundColor={colors.palette.accent100}
              />
            ) : (
              <Text text="You haven't recorded your score yet." />
            )
          }
          stickySectionHeadersEnabled
          renderItem={({ item, index }) => (
            <View>
              <UserScore
                key={index}
                {...item}
                exercise={rootStore.exerciseById(item.exercise)?.name}
              />
            </View>
          )}
        />
      </Screen>
    )
  },
)

function UserScore(item: ExerciseResult & ViewStyle) {
  const { exercise, name, score, time, image, ...extraStyle } = item
  return (
    <Card
      style={{ ...$item, ...extraStyle }}
      verticalAlignment="force-footer-bottom"
      HeadingComponent={
        <Text
          style={$metadataText}
          size="xxs"
          accessibilityLabel={new Date(time)?.toLocaleTimeString()}
        >
          {new Date(time)?.toLocaleTimeString()} - {exercise}
        </Text>
      }
      ContentComponent={
        <View style={$textContainer}>
          <Text preset="bold" size="xl" style={$countText}>
            {score}
          </Text>
          <Text>by {name}</Text>
        </View>
      }
      RightComponent={<AutoImage source={{ uri: image }} style={$itemThumbnail} />}
    />
  )
}

const $root: ViewStyle = {
  flex: 1,
}
const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.large,
  paddingTop: spacing.large,
  paddingBottom: spacing.large,
}
const $textContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}
const $item: ViewStyle = {
  paddingHorizontal: spacing.medium,
  marginTop: spacing.medium,
}

const $itemThumbnail: ImageStyle = {
  marginTop: spacing.small,
  borderRadius: 50,
  width: 50,
  height: 50,
  alignSelf: "flex-start",
}

const $metadataText: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.extraSmall,
  marginEnd: spacing.medium,
  marginBottom: spacing.extraSmall,
}

const $countText: TextStyle = {
  marginRight: spacing.extraSmall,
}

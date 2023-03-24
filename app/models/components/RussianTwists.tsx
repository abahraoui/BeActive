import React, { useState, FC, useLayoutEffect } from "react"
import { View, ViewStyle } from "react-native"
import { Gyroscope } from "expo-sensors"
import Timer from "./Timer"
import { Subscription } from "expo-sensors/build/Pedometer"
import { Text } from "../../components"
import { Audio } from "expo-av"
import { observer } from "mobx-react-lite"
import { useStores } from "../helpers/useStores"
import { math } from "@tensorflow/tfjs"

const bellSound = require("../../../assets/sounds/bell.wav")

interface RussianTwistsProps {
  duration: number
  onComplete: () => void
}

export const RussianTwists: FC<RussianTwistsProps> = observer(function (props) {
  const {
    exerciseTrackerStore: { incrementCurrentCount, currentCount },
  } = useStores()
  const [subscription, setSubscription] = useState<Subscription>(null)
  const [sound, setSound] = React.useState<Audio.Sound>()

  const _subscribe = () => {
    let  previousY: number
    let previousUpdate = 0
    const turnThreshold = 1.5
    

    setSubscription(
      Gyroscope.addListener(function (data) {
        const { y} = data

        const currentTime = Date.now()
        if (currentTime - previousUpdate > 300) {
          const difference = currentTime - previousUpdate
          previousUpdate = currentTime
          const speed = Math.abs(y*previousY)
          if ((y*previousY < 0) && (difference > 300) && (speed > turnThreshold) ) {
            incrementCurrentCount()
            console.log("new currentCount", currentCount)
            playSound()
          }

          previousY = y

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
      <Text text={`Russian Twists: ${currentCount}`} preset="bold" />
    </View>
  )
})

const container: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

export default RussianTwists

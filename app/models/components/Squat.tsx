import { Audio } from "expo-av"
import { observer } from "mobx-react-lite"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Text } from "../../components/Text"
import { useStores } from "../helpers/useStores"

const bellSound = require("../../../assets/sounds/bell.wav")

interface SquatProps {
    poses: any
}

export const Squat: React.FC<SquatProps> = observer(function (props) {
    const { exerciseTrackerStore } = useStores()
    const [sound, setSound] = React.useState<Audio.Sound>()
    const left_y = useRef(0)
    const right_y = useRef(0)
    const base_left = useRef(0)
    const base_right = useRef(0)
    const atBasePos = useRef(true)
    const [poses, setPoses] = useState([])

    useEffect(() => {
        setPoses(props.poses)
        if (poses) countReps()
    })
    useLayoutEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync()
            }
            : undefined
    }, [sound])

    const countReps = () => {
        if (poses && poses.length > 0) {
            const newleft_y = poses[0].keypoints[11].y
            const newright_y = poses[0].keypoints[12].y

            if (left_y.current === 0 && right_y.current === 0) {
                base_left.current = newleft_y + 10
                base_right.current = newright_y + 10
                left_y.current = newleft_y
                right_y.current = newright_y
            }
            if (newleft_y >= left_y.current + 30 && newright_y >= right_y.current + 30 && atBasePos) {
                exerciseTrackerStore.incrementCurrentCount()
                playSound()
                atBasePos.current = false
            }
            if (newleft_y <= base_left.current && newright_y <= base_right.current) {
                atBasePos.current = true
            }
            left_y.current = newleft_y
            right_y.current = newright_y
        }
    }

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(bellSound)
        setSound(sound)
        console.log("🚀 playSound")
        await sound.playAsync()
    }

    return (
        <View style={countContainer}>
            <Text>Rep count: {exerciseTrackerStore.currentCount}</Text>
        </View>
    )
})

const countContainer: ViewStyle = {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, .7)",
    borderRadius: 2,
    left: 10,
    padding: 8,
    position: "absolute",
    top: 10,
    zIndex: 20,
}

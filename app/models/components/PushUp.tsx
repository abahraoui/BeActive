import {useEffect, useRef, useState} from "react";
import {View, Text, StyleSheet} from "react-native";


export default function PushUp(props) {
    const count = useRef(0);
    const left_y = useRef(0);
    const right_y = useRef(0);
    const base_left = useRef(0);
    const base_right = useRef(0);
    const atBasePos = useRef(true);
    const [poses, setPoses] = useState([])

    useEffect(() => {
        setPoses(props.poses)
        console.log(poses)
        if (poses)
            countReps();
    })
    //  console.log(count)
    //
    const countReps = () => {
        if (poses && poses.length > 0) {


            const newleft_y = poses[0].keypoints[5].y;
            const newright_y = poses[0].keypoints[6].y;

            if (left_y.current == 0 && right_y.current == 0) {
                base_left.current = newleft_y + 10;
                base_right.current = newright_y + 10;
                left_y.current = newleft_y;
                right_y.current = newright_y;
                console.log("left", left_y);
                console.log("right", right_y);
            }
            console.log("left", left_y);
            console.log("right", right_y);
            console.log("left", newleft_y);
            console.log("right", newright_y);
            console.log("atBasePos", atBasePos);
            if (newleft_y >= left_y.current + 30 && newright_y >= right_y.current + 30 && atBasePos) {
                count.current++;
                atBasePos.current = false;
            }
            if (newleft_y <= base_left.current && newright_y <= base_right.current) {
                atBasePos.current = true;
            }
            left_y.current = newleft_y;
            right_y.current = newright_y;

        }


    }

    return (<View style={styles.countContainer}>
        <Text>Rep count: {count.current - 1}</Text>
    </View>);


}

const styles = StyleSheet.create({
    countContainer: {
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, .7)",
        borderRadius: 2,
        left: 10,
        padding: 8,
        position: "absolute",
        top: 10,
        width: 80,
        zIndex: 20
    }
})




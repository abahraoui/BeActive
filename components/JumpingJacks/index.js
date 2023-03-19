import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Accelerometer } from "expo-sensors";
import Timer from "../Timer/index.js";

const JumpingJacks = (props) => {
  const [repCount, setCount] = useState(0);
  const [subscription, setSubscription] = useState(null);

  const _subscribe = () => {
    //basically react native shake but I needed control of the shakethreshold

    var previousX, previousY, previousZ;
    var previousUpdate = 0;
    var shakeThreshold = 360;
    var count = 0;

    setSubscription(
      Accelerometer.addListener((data) => {
        var { x, y, z } = data;

        var currentTime = Date.now();
        if (currentTime - previousUpdate > 100) {
          var difference = currentTime - previousUpdate;
          previousUpdate = currentTime;
          var speed =
            (Math.abs(x + y + z - previousX - previousY - previousZ) /
              difference) *
            10000;
          if (speed > shakeThreshold) {
            count += 1;
            setCount(count);
          }
          previousX = x;
          previousY = y;
          previousZ = z;
        }
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const exerciseFinished = () => {
    alert("exercise complete, you did " + repCount + " Jumping Jacks!");
    _unsubscribe();
  };

  return (
    <View style={styles.container}>
      <Timer duration={props.duration} onComplete={exerciseFinished} />
      <Text style={styles.text}>Jumping jacks: {repCount}</Text>
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity
          onPress={subscription ? _unsubscribe : _subscribe}
          style={styles.button}
        >
          <Text>{subscription ? "On" : "Off"}</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "white",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  buttonContainer: {
    color: "white",
  },
});

export default JumpingJacks;

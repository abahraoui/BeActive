import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Gyroscope, DeviceMotion } from "expo-sensors";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

export default function App() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [{ alpha, beta, gamma }, setRotation] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const [subscription, setSubscription] = useState(null);
  const [motionData, setMotionData] = useState(null);

  const _slow = () => Gyroscope.setUpdateInterval(1000); //Change for updating frequncy
  const _fast = () => Gyroscope.setUpdateInterval(16); //Change for updating frequncy
  DeviceMotion.setUpdateInterval(100); //Change for printing frequncy

  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener((gyroscopeData) => {
        setData(gyroscopeData);
      })
    );
    setSubscription(
      DeviceMotion.addListener((motionData) => {
        // console.log(motionData);
        setMotionData(motionData);
        setRotation(motionData.rotation);
      })
    );
  };

  //https://www.w3resource.com/javascript-exercises/javascript-math-exercise-34.php
  function radians_to_degrees(radians) {
    const pi = Math.PI;
    return radians * (180 / pi);
  }

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}> motion: {motiondata}</Text> */}
      <Text style={styles.text}>Rotation:</Text>
      <Text style={styles.text}>
        x: {Math.round(radians_to_degrees(alpha) + 180)}
      </Text>
      <Text style={styles.text}>
        y: {Math.round(radians_to_degrees(beta) + 180)}
      </Text>
      <Text style={styles.text}>
        z: {Math.round(radians_to_degrees(gamma) + 180)}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={subscription ? _unsubscribe : _subscribe}
          style={styles.button}
        >
          <Text>{subscription ? "On" : "Off"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={_slow}
          style={[styles.button, styles.middleButton]}
        >
          <Text>Slow</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={_fast} style={styles.button}>
          <Text>Fast</Text>
        </TouchableOpacity>
      </View>
      <Text>Open up App.js to start working on your Cum</Text>
      <StatusBar style="auto" />
    </View>
  );
}

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

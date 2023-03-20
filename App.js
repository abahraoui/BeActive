import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, TouchableOpacity, Text, View, Button, Platform } from "react-native";

import registerNNPushToken from 'native-notify';


export default function App() {

  registerNNPushToken(6835, '3JDmzE93aUSy36djFJryGd'); //ALL THATS NEEDED OMG :SOB: :SOB:
  // This uses a web service, the login will be made available in discord!

  return (
    <View style={styles.container}>
    <Text>I hate this</Text>
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
});
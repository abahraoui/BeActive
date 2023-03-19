import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import JumpingJacks from "./components/JumpingJacks/index.js";

export default function App() {
  return <JumpingJacks duration={10} />;
}

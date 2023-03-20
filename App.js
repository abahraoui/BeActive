import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { Gyroscope, DeviceMotion } from "expo-sensors";
import { StyleSheet, TouchableOpacity, Text, View, Button, Platform } from "react-native";
import * as Notifications from 'expo-notifications';
import * as Permission from "expo-permissions";
import * as Device from 'expo-device';

import registerNNPushToken from 'native-notify';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

export default function App() {

  registerNNPushToken(6835, '3JDmzE93aUSy36djFJryGd');
  // const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });

  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  // useEffect(() => {
  //   Permission.getAsync(Permission.NOTIFICATIONS)
  //     .then((response) => {
  //       if (response.status !== "granted") {
  //         return Permission.askAsync(Permission.NOTIFICATIONS);
  //       }
  //       return response;
  //     })
  //     .then((response) => {
  //       if (response.status !== "granted") {
  //         return;
  //       }
  //     });
  // }, []);


  // const handleNotification = () => {
  //   Notification.scheduleNotificationAsync({
  //     content: {
  //       title: "Local Notification",
  //       body: "This is my local notification",
  //     },
  //     trigger: {
  //       seconds: 10,
  //     },
  //   });
  // };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}> motion: {motiondata}</Text> */}
      {/* <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}> */}
        {/* <Button title={"Open Notification"} onPress={handleNotification} /> */}
      {/* <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View> */}
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

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: 'Here is the notification body',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 2 },
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   return token;
// }
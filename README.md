# Welcome!  👋

![image](https://user-images.githubusercontent.com/106979580/237055646-bc1d5a81-500c-401f-b3c7-a6d0762da7fe.png)       ![image](https://user-images.githubusercontent.com/106979580/237055677-d5323630-aa38-4fc0-8fc2-b5bb352d0622.png)       ![image](https://user-images.githubusercontent.com/106979580/237055695-694807b7-8c9e-4809-bbc3-d199adda502e.png)       ![image](https://user-images.githubusercontent.com/106979580/237055713-851e1166-9b4c-470f-a0a0-bd626ad877e3.png)

BeActive is React Native mobile app 'prototype' made to study cross-platform mobile development as part of our curriculum.

We aimed to have a positive impact on our user's wellbeing by designing an app which would help them be physically active as well as connect with others. We wanted users to engage positively with the physical activity, so we quickly settled on short bursts of activity the user can engage with whenever they choose, but we will also send them a notification that an exercise has been selected for them for the day to keep them engaged! Through various methods we check how the user performed during the exercise, then to keep everyone connected and motivated we want users to share their performance with their friends on the social feed. By having our users engaged with physical activity, engaging with others as well as giving and receiving positive feedback we hope to support people's wellbeing.

We chose to create an Expo-powered React Native application. Our frontend started with an Ignite boilerplate. We used the Expo API for access to the device sensors (Accelerometer, Gyroscope) and Native Notify to deliver push notifications. We are also using the TensorFlow.js library to enable camera-recorded exercise recognition for various exercises.

## Running the project

`npm run expo:start`

## The latest and greatest boilerplate for Infinite Red opinions

This is the boilerplate that [Infinite Red](https://infinite.red) uses as a way to test bleeding-edge changes to our React Native stack.

Currently includes:

- React Native
- React Navigation
- MobX State Tree
- TypeScript
- And more!

## Quick Start

The Ignite boilerplate project's structure will look similar to this:

```
ignite-project
├── app
│   ├── components
│   ├── config
│   ├── i18n
│   ├── models
│   ├── navigators
│   ├── screens
│   ├── services
│   ├── theme
│   ├── utils
│   ├── app.tsx
├── test
│   ├── __snapshots__
│   ├── mockFile.ts
│   ├── setup.ts
├── README.md
├── android
│   ├── app
│   ├── build.gradle
│   ├── gradle
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   ├── keystores
│   └── settings.gradle
├── ignite
│   └── templates
|       |── app-icon
│       ├── component
│       ├── model
│       ├── navigator
│       └── screen
├── index.js
├── ios
│   ├── IgniteProject
│   ├── IgniteProject-tvOS
│   ├── IgniteProject-tvOSTests
│   ├── IgniteProject.xcodeproj
│   └── IgniteProjectTests
├── .env
└── package.json

```

### ./app directory

Included in an Ignite boilerplate project is the `app` directory. This is a directory you would normally have to create when using vanilla React Native.

The inside of the `app` directory looks similar to the following:

```
app
├── components
├── config
├── i18n
├── models
├── navigators
├── screens
├── services
├── theme
├── utils
├── app.tsx
```

**components**
This is where your reusable components live which help you build your screens.

**i18n**
This is where your translations will live if you are using `react-native-i18n`.

**models**
This is where your app's models will live. Each model has a directory which will contain the `mobx-state-tree` model file, test file, and any other supporting files like actions, types, etc.

**navigators**
This is where your `react-navigation` navigators will live.

**screens**
This is where your screen components will live. A screen is a React component which will take up the entire screen and be part of the navigation hierarchy. Each screen will have a directory containing the `.tsx` file, along with any assets or other helper files.

**services**
Any services that interface with the outside world will live here (think REST APIs, Push Notifications, etc.).

**theme**
Here lives the theme for your application, including spacing, colors, and typography.

**utils**
This is a great place to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truly shared across your application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.

**app.tsx** This is the entry point to your app. This is where you will find the main App component which renders the rest of the application.

### ./ignite directory

The `ignite` directory stores all things Ignite, including CLI and boilerplate items. Here you will find templates you can customize to help you get started with React Native.

### ./test directory

This directory will hold your Jest configs and mocks.

## Running Detox end-to-end tests

Read [Detox setup instructions](./detox/README.md).

## Previous Boilerplates

- [2018 aka Bowser](https://github.com/infinitered/ignite-bowser)
- [2017 aka Andross](https://github.com/infinitered/ignite-andross)
- [2016 aka Ignite 1.0](https://github.com/infinitered/ignite-ir-boilerplate-2016)

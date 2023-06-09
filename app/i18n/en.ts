const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
  },
  welcomeScreen: {
    toExercise: "Get Active!",
    sendNotification: "Send notification",
  },
  exerciseTrackerScreen: {
    todaysExerciseIs: "Today's exercise is",
    startExercise: "Start exercise",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
  errors: {
    invalidEmail: "Invalid email address.",
  },
  loginScreen: {
    signIn: "Sign In",
    enterDetails:
      "Enter your name below. This is needed to save your scores. (Note: this data is only stored on your device.)",
    nameFieldLabel: "Name",
    nameFieldPlaceholder: "Enter your name",
    tapToSignIn: "Tap to sign in!",
  },
}

export default en
export type Translations = typeof en

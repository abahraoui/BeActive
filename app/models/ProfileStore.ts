import AsyncStorage from "@react-native-async-storage/async-storage"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { STORAGE_KEYS } from "../utils/constants"

export const ScoreModel = types.model("ScoreModel").props({
  score: types.number,
  exerciseId: types.string,
})

export const ProfileStoreModel = types
  .model("AuthenticationStore")
  .props({
    name: "",
    scores: types.array(ScoreModel),
  })
  .actions((store) => ({
    setName(value?: string) {
      store.name = value
    },
    addScore(score: number, exerciseId: string) {
      store.scores.push({ score, exerciseId })
    },
  }))
  .actions((store) => ({
    async afterCreate() {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE_NAME)
      console.log("🚀 ~ file: LoginScreen.tsx:23 ~ loadName ~ value:", value)
      if (value) store.setName(value)
    },
    logout() {
      store.setName("")
    },
  }))
  .views((store) => ({
    get isLoggedIn() {
      return !!store.name
    },
    get lastScore(): Score {
      if (store.scores.length === 0) return { score: 0, exerciseId: "" }
      return store.scores[store.scores.length - 1]
    },
  }))

export interface Score extends Instance<typeof ScoreModel> {}

export interface ProfileStore extends Instance<typeof ProfileStoreModel> {}
export interface ProfileStoreSnapshot extends SnapshotOut<typeof ProfileStoreModel> {}

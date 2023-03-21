import AsyncStorage from "@react-native-async-storage/async-storage"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { STORAGE_KEYS } from "../utils/constants"

export const UserScoreModel = types.model("ScoreModel").props({
  score: types.number,
  exerciseId: types.string,
  time: types.Date,
})

export const ProfileStoreModel = types
  .model("AuthenticationStore")
  .props({
    name: "",
    scores: types.array(UserScoreModel),
  })
  .actions((store) => ({
    setName(value?: string) {
      store.name = value
    },
    addScore(score: number, exerciseId: string, time: Date) {
      store.scores.push({ score, exerciseId, time })
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
    get lastScore(): UserScore | null {
      if (store.scores.length === 0) return null
      return store.scores[store.scores.length - 1]
    },
  }))

export interface UserScore extends Instance<typeof UserScoreModel> {}

export interface ProfileStore extends Instance<typeof ProfileStoreModel> {}
export interface ProfileStoreSnapshot extends SnapshotOut<typeof ProfileStoreModel> {}

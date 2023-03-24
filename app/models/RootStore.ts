import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ExerciseModel } from "./Exercise"
import { ProfileStoreModel } from "./ProfileStore"
import { api } from "../services/api"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { ExerciseTrackerStoreModel } from "./ExerciseTrackerStore"

export const RootStoreModel = types
  .model("RootStore")
  .props({
    exerciseTrackerStore: types.optional(ExerciseTrackerStoreModel, {}),
    profileStore: types.optional(ProfileStoreModel, {}),
    exercises: types.array(ExerciseModel),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    loadExercises: () => self.setProp("exercises", api.getExercises()),
  }))
  .views((self) => ({
    exerciseById(id: string) {
      return self.exercises.find((exercise) => exercise.id === id)
    },
  }))

export interface RootStore extends Instance<typeof RootStoreModel> {}
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

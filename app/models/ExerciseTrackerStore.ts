import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { Exercise, ExerciseModel } from "./Exercise"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const ExerciseTrackerStoreModel = types
  .model("ExerciseTrackerStore")
  .props({
    currentExercise: types.maybe(types.reference(ExerciseModel)),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    setCurrentExercise(exercise: Exercise) {
      self.currentExercise = exercise
    },
  }))
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ExerciseTrackerStore extends Instance<typeof ExerciseTrackerStoreModel> {}
export interface ExerciseTrackerStoreSnapshotOut
  extends SnapshotOut<typeof ExerciseTrackerStoreModel> {}
export interface ExerciseTrackerStoreSnapshotIn
  extends SnapshotIn<typeof ExerciseTrackerStoreModel> {}
export const createExerciseTrackerStoreDefaultModel = () =>
  types.optional(ExerciseTrackerStoreModel, {})

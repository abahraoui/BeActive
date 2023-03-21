import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { Exercise, ExerciseModel } from "./Exercise"
import { withSetPropAction } from "./helpers/withSetPropAction"

export enum ExerciseTrackingState {
  NOT_STARTED = "NOT_STARTED",
  RUNNING = "RUNNING",
  ENDED = "ENDED",
}

export const ExerciseTrackerStoreModel = types
  .model("ExerciseTrackerStore")
  .props({
    currentExercise: types.maybe(types.reference(ExerciseModel)),
    currentCount: types.optional(types.number, -1),
    state: types.optional(
      types.enumeration<ExerciseTrackingState>([
        ExerciseTrackingState.NOT_STARTED,
        ExerciseTrackingState.RUNNING,
        ExerciseTrackingState.ENDED,
      ]),
      ExerciseTrackingState.NOT_STARTED,
    ),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    setCurrentExercise(exercise: Exercise) {
      self.currentExercise = exercise
    },
    incrementCurrentCount() {
      self.currentCount += 1
    },
    resetCurrentCount() {
      self.currentCount = 0
    },
  }))

export interface ExerciseTrackerStore extends Instance<typeof ExerciseTrackerStoreModel> {}
export interface ExerciseTrackerStoreSnapshotOut
  extends SnapshotOut<typeof ExerciseTrackerStoreModel> {}
export interface ExerciseTrackerStoreSnapshotIn
  extends SnapshotIn<typeof ExerciseTrackerStoreModel> {}
export const createExerciseTrackerStoreDefaultModel = () =>
  types.optional(ExerciseTrackerStoreModel, {})

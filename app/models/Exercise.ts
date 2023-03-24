import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const ExerciseModel = types
  .model("Exercise")
  .props({
    id: types.identifier,
    name: types.string,
    description: types.string,
    count: types.number,
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Exercise extends Instance<typeof ExerciseModel> {}
export interface ExerciseSnapshotOut extends SnapshotOut<typeof ExerciseModel> {}
export interface ExerciseSnapshotIn extends SnapshotIn<typeof ExerciseModel> {}
export const createExerciseDefaultModel = () => types.optional(ExerciseModel, {})

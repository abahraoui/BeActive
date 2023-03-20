import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ExerciseModel } from "./Exercise"
import { AuthenticationStoreModel } from "./AuthenticationStore" // @demo remove-current-line
import { EpisodeStoreModel } from "./EpisodeStore" // @demo remove-current-line
import { api } from "../services/api"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { ExerciseTrackerStoreModel } from "./ExerciseTrackerStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types
  .model("RootStore")
  .props({
    exerciseTrackerStore: types.optional(ExerciseTrackerStoreModel, {}),
    authenticationStore: types.optional(AuthenticationStoreModel, {}), // @demo remove-current-line
    episodeStore: types.optional(EpisodeStoreModel, {}), // @demo remove-current-line
    exercises: types.array(ExerciseModel),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    afterCreate: () => {
      // self.exercises = api.getExercises() as any;
      self.setProp("exercises", api.getExercises())
      console.log("RootStoreModel.afterCreate", JSON.stringify(self.exercises))
    },
  }))

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

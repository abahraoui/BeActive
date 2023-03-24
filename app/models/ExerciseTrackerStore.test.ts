import { ExerciseTrackerStoreModel } from "./ExerciseTrackerStore"

test("can be created", () => {
  const instance = ExerciseTrackerStoreModel.create({})

  expect(instance).toBeTruthy()
})

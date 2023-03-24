import { ExerciseModel } from "./Exercise"

test("can be created", () => {
  const instance = ExerciseModel.create({})

  expect(instance).toBeTruthy()
})

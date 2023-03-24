/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import type { ExerciseSnapshotIn } from "../../models"
import { ExerciseResult } from "../../screens"

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  getExercises(): ExerciseSnapshotIn[] {
    return [
      {
        id: "push-ups",
        name: "Push ups",
        description:
          "Place your phone next to a wall and be as close to it as you can. Make sure your shoulders are visible to the camera. Do as many pushups as you can in one minute.",
        count: 10,
      },
      {
        id: "jumping-jacks",
        name: "Jumping jacks",
        description:
          "Do as many jumping jacks as you can in a minute. Hold your phone in your hand while doing the exercise.",
        count: 10,
      },
      {
        id: "squats",
        name: "Squats",
        description:
          "Place your phone next to a wall and be as close to it as you can. Make sure your hips are visible to the camera. Do as many squats as you can in one minute.",
        count: 10,
      },
      {
        id: "russian-twists",
        name: "Russian twists",
        description:
          "Lie down on the ground, and lift your torso to an approximate 45 degree angle from the ground. Hold your phone in your hands, in front of your chest. Turn chest to the left, then to the right, with your core tight at all times. If you wish to make the exercise a bit more difficult, lift your feet up, having only your glutes touching the ground. ",
        count: 10,
      },
    ]
  }

  async getSocialResults(exercise?: ExerciseSnapshotIn): Promise<ExerciseResult[]> {
    const response = await fetch("https://randomuser.me/api/?results=10&inc=name,picture&noinfo")

    const exercises = this.getExercises().map((e) => e.id)
    const chosenExercise = exercise ?? exercises[Math.floor(Math.random() * exercises.length)]
    if (!response.ok) return []

    try {
      const rawData = await response.json()

      const results: ExerciseResult[] = rawData.results.map((raw: any) => ({
        name: `${raw.name.first}`,
        exercise: chosenExercise,
        score: Math.floor(Math.random() * 100),
        time: new Date().setHours(Math.random() * 24, Math.random() * 60),
        image: raw.picture.large,
      }))

      return results
    } catch (e) {
      return []
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()

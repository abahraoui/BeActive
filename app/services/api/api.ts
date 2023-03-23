/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://github.com/infinitered/ignite/blob/master/docs/Backend-API-Integration.md)
 * documentation for more details.
 */
import {
  ApiResponse, // @demo remove-current-line
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem" // @demo remove-current-line
import type {
  ApiConfig,
  ApiFeedResponse, // @demo remove-current-line
} from "./api.types"
import type { EpisodeSnapshotIn } from "../../models/Episode" // @demo remove-current-line
import type { ExerciseSnapshotIn } from "../../models"
import { ExerciseResult } from "../../screens"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  // @demo remove-block-start
  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      // This is where we transform the data into the shape we expect for our MST model.
      const episodes: EpisodeSnapshotIn[] = rawData.items.map((raw) => ({
        ...raw,
      }))

      return { kind: "ok", episodes }
    } catch (e) {
      if (__DEV__) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
  // @demo remove-block-end

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
        id: "walking",
        name: "Walking",
        description: "We will measure your steps.",
        count: 10,
      },
      {
        id: "squats",
        name: "Squats",
        description:
          "Place your phone next to a wall and be as close to it as you can. Make sure your hips are visible to the camera. Do as many squats as you can in one minute.",
        count: 10,
      },
    ]
  }

  async getSocialResults(): Promise<ExerciseResult[]> {
    const response = await fetch("https://randomuser.me/api/?results=10&inc=name,picture&noinfo")

    if (!response.ok) return []

    try {
      const rawData = await response.json()
      const exercises = this.getExercises().map((e) => e.id)
      const randomExercise = () => exercises[Math.floor(Math.random() * exercises.length)]

      const results: ExerciseResult[] = rawData.results.map((raw: any) => ({
        name: `${raw.name.first}`,
        exercise: randomExercise(),
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

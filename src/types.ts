/*
 * jspsych-staircase
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This file contains custom types.
 */

// Type for the return object of the calculateStats() function
export type CycleStats = {
  accuracy: number;
  adjustedDifficulty: number;
};
// Type for the parameter that is passed to the postCycleCallback function if it
// is provided
export type PostCycleCallbackData = {
  adjustedDifficulty: number;
  cycleAccuracy: number;
  cyclesCarriedOut: number;
  finished: boolean;
};
// Type for the function that can be supplied to customize how difficulty is
// adjusted after each trial
export type CustomDifficultyAdjuster = (
  difficulty: Difficulty,
  accuracy: number,
  targetAccuracy: number
) => number;
// Type for the difficulty object
export type Difficulty = {
  max: number;
  min: number;
  get: () => number;
  set: (value: number) => void;
};
// Type for the configuration object
export type Configuration = {
  jsPsychInstance: any;
  targetAccuracy: number;
  numberOfCycles: number;
  dataLabel: string;
  difficulty: Difficulty;
  cycle: any;
  postCycleCallback?: (cycleData: PostCycleCallbackData) => void;
  customDifficultyAdjuster?: CustomDifficultyAdjuster;
};

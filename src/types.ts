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
  postCycleCallback: (cycleData: {
    adjustedDifficulty: number;
    cycleAccuracy: number;
    cyclesCarriedOut: number;
    finished: boolean;
  }) => void;
  difficulty: Difficulty;
  cycle: any;
};

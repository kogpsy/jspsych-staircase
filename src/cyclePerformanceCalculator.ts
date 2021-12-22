/*
 * jspsych-staircase
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This file contains a helper to calculate cycle performance
 */

import { Difficulty, CycleStats } from './types';

/**
 * Calculates performance in the previous cycle and suggests a new difficulty
 *
 * @param data A jsPsych data object containing the trials of interest
 * @param difficulty A difficulty object containing max, min, set and get fields
 * @param dataLabel The label which should be present on the trials of interest
 * @param targetAccuracy The desired target accuracy
 * @returns {CycleStats} An object containing the accuracy of the past cycle as
 * well as the adjusted difficulty
 */
export const calculateCyclePerformance = (
  data: any,
  difficulty: Difficulty,
  dataLabel: string,
  targetAccuracy: number
): CycleStats => {
  // Calculate the difference between max and min
  const difficultyRange: number = difficulty.max - difficulty.min;
  // Grab all relevant trials according to dataLabel parameter
  const relevantTrials: any = data.filter({ data_label: dataLabel });
  // Count the correct responses
  const numberOfCorrectResponses: number = relevantTrials
    .filter({ correct: true })
    .count();
  // Calculate accuracy based on correct responses
  const accuracy: number = numberOfCorrectResponses / relevantTrials.count();
  // Adjust difficulty by half the deviation from measured to target accuracy.
  // Example: If the measured accuracy is 20% higher than the target accuracy,
  // increase difficulty by 10%.
  let adjustedDifficulty: number =
    difficulty.get() + ((accuracy - targetAccuracy) / 2) * difficultyRange;
  // Make sure we remain in the bounds
  if (difficulty.max > difficulty.min) {
    if (adjustedDifficulty > difficulty.max) {
      adjustedDifficulty = difficulty.max;
    } else if (adjustedDifficulty < difficulty.min) {
      adjustedDifficulty = difficulty.min;
    }
  } else if (difficulty.min > difficulty.max) {
    if (adjustedDifficulty > difficulty.min) {
      adjustedDifficulty = difficulty.min;
    } else if (adjustedDifficulty < difficulty.max) {
      adjustedDifficulty = difficulty.max;
    }
  }
  // Return a CycleStats object
  return {
    accuracy,
    adjustedDifficulty,
  };
};

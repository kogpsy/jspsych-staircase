/*
 * jspsych-staircase
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This file contains tools which help to create a staircase method timeline for
 * a jsPsych experiment.
 */

import { parse } from 'path/posix';
import { parseConfig } from './config';

// Import types
import { Configuration, Difficulty, CycleStats } from './types';

/**
 * Generates a configurable jsPsych staircase method timeline
 *
 * @param conf The configuration object
 * @returns Timeline
 */
export const generateStaircaseTimeline = (conf: Configuration): any => {
  // Make sure the configuration object is valid
  parseConfig(conf);
  // Initialize cycles counter
  let cyclesCarriedOut: number = 0;
  // Define the loop node
  const cycleLoop: any = {
    // Take the cycle provided and set it as the timeline to loop
    timeline: [conf.cycle],
    // Define the loop function (the above timeline is run once, and then this
    // function is run to evaluate whether the timeline should run once more)
    loop_function: (data: any) => {
      // Increment cycles counter
      cyclesCarriedOut++;
      // Was this the last cycle?
      const wasLastCycle: boolean =
        cyclesCarriedOut >= conf.numberOfCycles ? true : false;
      // Evaluate accuracy using a helper (defined below)
      const { accuracy, adjustedDifficulty } = calculateStats(
        data,
        conf.difficulty,
        conf.dataLabel,
        conf.targetAccuracy
      );
      // Set the difficulty using the provided setter
      conf.difficulty.set(adjustedDifficulty);
      // Call back and notify about progress
      conf.postCycleCallback({
        adjustedDifficulty,
        cycleAccuracy: accuracy,
        cyclesCarriedOut,
        finished: wasLastCycle,
      });

      // If this was the last cycle, break the loop by returning false
      return wasLastCycle ? false : true;
    },
  };
  // Then return the loop node
  return cycleLoop;
};

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
const calculateStats = (
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
  if (adjustedDifficulty > difficulty.max) {
    adjustedDifficulty = difficulty.max;
  } else if (adjustedDifficulty < difficulty.min) {
    adjustedDifficulty = difficulty.min;
  }
  // Return a CycleStats object
  return {
    accuracy,
    adjustedDifficulty,
  };
};

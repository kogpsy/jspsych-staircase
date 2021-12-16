/*
 * jspsych-staircase
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This file contains tools which help to create a staircase method timeline for
 * a jsPsych experiment.
 */

// Import helper
import { calculateCyclePerformance } from './cyclePerformanceCalculator';

// Import types
import { Configuration, Difficulty, CycleStats } from './types';

/**
 * Generates a configurable jsPsych staircase method timeline
 *
 * @param conf The configuration object
 * @returns Timeline
 */
export const generateStaircaseTimeline = (conf: Configuration): any => {
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
      const { accuracy, adjustedDifficulty } = calculateCyclePerformance(
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

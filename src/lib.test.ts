/*
 * jspsych-staircase
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This file contains tests for the 'lib.ts' module.
 */

import { generateStaircaseTimeline } from './lib';

import { Configuration } from './types';

// Tests if the generated jsPsych node contains a timeline and a loop function.
// Does not test if the loop function works properly, but merely checks, if the
// resulting node is structured correctly.
test('uses generateStaircaseTimeline() to generate a jsPsych timeline', () => {
  const config: Configuration = {
    jsPsychInstance:
      'This test just tests if the generated timeline is valid, it does not run it.',
    targetAccuracy: 70,
    numberOfCycles: 10,
    dataLabel: 'staircase',
    difficulty: {
      max: 1,
      min: 0,
      set: (val) => {},
      get: () => {
        return 1;
      },
    },
    postCycleCallback: (cycleData) => {
      console.log(cycleData);
    },
    cycle: {
      timeline: ['not', 'relevant'],
    },
  };
  const timeline = generateStaircaseTimeline(config);
  expect(timeline).toHaveProperty('timeline', [
    {
      timeline: ['not', 'relevant'],
    },
  ]);
  expect(timeline).toHaveProperty('loop_function');
});

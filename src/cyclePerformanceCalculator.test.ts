/*
 * jspsych-staircase
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This file contains tests for the 'cyclePerformanceCalculator.ts' module.
 */

import { calculateCyclePerformance } from './cyclePerformanceCalculator';
import { Difficulty } from './types';
import { initJsPsych } from 'jspsych';

// Test if the calculated accuracy and adjusted difficulty is correct based on
// the fake data object
test('calculates a cycle performance', () => {
  // Mock a DataCollection object
  const jsPsych = initJsPsych();
  let data = jsPsych.data.get();
  data.push({
    data_label: 'data',
    correct: true,
  });
  data.push({
    data_label: 'data',
    correct: true,
  });
  data.push({
    data_label: 'data',
    correct: true,
  });
  data.push({
    data_label: 'data',
    correct: false,
  });
  data.push({
    data_label: 'data',
    correct: false,
  });
  data.push({
    data_label: 'irrelevant',
    correct: true,
  });

  // Mock a difficulty object
  let difficulty = 0.5;
  const setDifficulty = (value: number) => {
    difficulty = value;
  };
  const getDifficulty = (): number => {
    return difficulty;
  };

  // Calculate the stats
  const { accuracy, adjustedDifficulty } = calculateCyclePerformance(
    data,
    {
      max: 1,
      min: 0,
      get: getDifficulty,
      set: setDifficulty,
    },
    'data',
    0.7
  );
  // And perform tests
  expect(accuracy).toBe(0.6);
  expect(adjustedDifficulty).toBe(0.45);
});

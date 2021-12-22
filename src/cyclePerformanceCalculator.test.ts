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

// Test if the calculated accuracy and adjusted difficulty is correct based on
// the fake data object
test('calculates a cycle performance', () => {
  // Create a difficulty variable
  let difficulty = 0.5;

  // Calculate the stats
  const { accuracy, adjustedDifficulty } = calculateCyclePerformance(
    data,
    {
      max: 1,
      min: 0,
      get: (): number => {
        return difficulty;
      },
      set: (value: number) => {
        difficulty = value;
      },
    },
    'data',
    0.7
  );
  // And perform tests
  expect(accuracy).toBe(0.6);
  expect(adjustedDifficulty).toBe(0.45);
});

// Sometimes (e.g. with presentation times) smaller numbers in difficulty
// actually mean the task is more difficult.
test('calculates a cycle performance with smaller difficulty means bigger difficulty', () => {
  // Create a difficulty variable
  let difficulty = 50;

  // Calculate the stats
  const { accuracy, adjustedDifficulty } = calculateCyclePerformance(
    data,
    {
      max: 0,
      min: 100,
      get: (): number => {
        return difficulty;
      },
      set: (value: number) => {
        difficulty = value;
      },
    },
    'data',
    0.7
  );
  // And perform tests
  expect(accuracy).toBe(0.6);
  expect(adjustedDifficulty).toBe(55);
});

/*
 * jspsych-staircase
 *
 * Author: Robin Bürkli <robuba.jr@gmx.ch>
 * License: MIT
 *
 * This file contains tests for the 'cyclePerformanceCalculator.ts' module.
 */

import { calculateCyclePerformance } from './cyclePerformanceCalculator';
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

// Checks if the difficulty remains inside the bounds (does not go below min or
// above max)
test('calculates a cycle performance hitting bounds using regular scale', () => {
  // Create a difficulty variable
  let difficulty = 4;
  // Calculate the stats
  const { accuracy, adjustedDifficulty } = calculateCyclePerformance(
    data,
    {
      max: 100,
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
  // Without bound control it would drop to -1, but it should get set to
  // difficulty.min if everything works properly
  expect(adjustedDifficulty).toBe(0);
});

// Checks if the difficulty remains inside the bounds (does not go above min or
// below max -> inverse scale is used)
test('calculates a cycle performance hitting bounds using inverse scale', () => {
  // Create a difficulty variable
  let difficulty = 96;
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
  // Without bound control it would drop to -1, but it should get set to
  // difficulty.min if everything works properly
  expect(adjustedDifficulty).toBe(100);
});

// Test if things work with a custom difficulty adjuster function
test('calculates a cycle performance using a custom adjuster function', () => {
  // Create a difficulty variable
  let difficulty = 50;
  // Calculate the stats
  const { accuracy, adjustedDifficulty } = calculateCyclePerformance(
    data,
    {
      max: 100,
      min: 0,
      get: (): number => {
        return difficulty;
      },
      set: (value: number) => {
        difficulty = value;
      },
    },
    'data',
    0.7,
    // Define a custom difficulty adjuster function
    (diff, acc, targetAcc) => {
      const diffRange = diff.max - diff.min;
      return diff.get() + (acc - targetAcc) * diffRange;
    }
  );
  // And perform tests
  expect(accuracy).toBe(0.6);
  expect(adjustedDifficulty).toBe(40);
});

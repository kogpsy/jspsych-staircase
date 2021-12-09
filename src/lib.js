/**
 *
 * @param params Parameters
 * @returns Timeline
 */
export const generateStaircaseTimeline = (params) => {
  // Initialize cycles counter
  let cyclesCarriedOut = 0;
  // Define the loop node
  const cycleLoop = {
    timeline: [params.cycle],
    loop_function: (data) => {
      // Increment cycles counter
      cyclesCarriedOut++;
      // Was this the last cycle?
      const wasLastCycle =
        cyclesCarriedOut >= params.numberOfCycles ? true : false;
      // Evaluate accuracy
      const { accuracy, adjustedDifficulty } = calculateStats(
        data,
        params.difficulty,
        params.dataLabel,
        params.targetAccuracy
      );
      // Set the provided difficulty value to the newly calculated one
      params.difficulty.set(adjustedDifficulty);
      // Call back and notify about progress
      params.postCycleCallback({
        adjustedDifficulty,
        cycleAccuracy: accuracy,
        cyclesCarriedOut,
        finished: wasLastCycle,
      });

      // If this was the last cycle, break the loop by returning false
      return wasLastCycle ? false : true;
    },
  };
  return cycleLoop;
};

const calculateStats = (data, difficulty, dataLabel, targetAccuracy) => {
  const difficultyRange = difficulty.max - difficulty.min;

  const relevantTrials = data.filter({ data_label: dataLabel });
  const numberOfCorrectResponses = relevantTrials
    .filter({ correct: true })
    .count();
  const accuracy = numberOfCorrectResponses / relevantTrials.count();
  let adjustedDifficulty =
    difficulty.get() + ((accuracy - targetAccuracy) / 2) * difficultyRange;

  // Make sure we remain in the bounds
  if (adjustedDifficulty > difficulty.max) {
    adjustedDifficulty = difficulty.max;
  } else if (adjustedDifficulty < difficulty.min) {
    adjustedDifficulty = difficulty.min;
  }

  return {
    accuracy,
    adjustedDifficulty,
  };
};

const parseConfig = (config) => {};

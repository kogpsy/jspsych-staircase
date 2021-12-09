# Notes

## Idea

Builds a timeline to assess one

Probably just exposes one function, e.g. `generateStaircaseTimeline()`.

In:

- TODO: difficulty: e.g. more coherence is easier, but more distractors is harder, figure out how to generalize. probably not in docs

```javascript
config = {
  // Instance of jsPsych of the experiment
  jsPsychInstance,
  // Accuracy that should be reached
  targetAccuracy: 0.7,
  // How many cycles should there be
  numberOfCycles: 12,
  // If, e.g. participants answer a yes/no question on the response screen, data on correctness should be saved under data.correct. under data.data_label, the trials should also get a label (like 'staircase'), with which they can be identified to calculate accuracy.
  dataLabel: 'my_label',
  // After each cycle this gets called with new difficulty
  postCycleCallback: (data) => {},
  // Difficulty object, the value key will be updated after each staircase cycle
  difficulty: {
    min: 1,
    max: 50,
    value: 25
  },

  // Define one cycle (as a jsPsych node)
  cycle: {
    // Timeline of one "trial" (e.g. fixation, presentation, response)
    timeline: [...],
    timeline_variables: [...],
    sample: {
      type: '...',
      size: 5
    },
    repetitions: 2,
  },
}
```

Out:

- A jsPsych nested timeline object. Integratable in existing timeline using many ways

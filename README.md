# jspsych-staircase

**Work in progress**

A small framework that integrates with jsPsych to build staircase method timelines.

## How to use

With the staircase method, one can measure individual perceptual thresholds. It can be used as a calibration which preceeds the actual experiment, to make sure the collected data points are clustered around the psychometric threshold.

As an example, let's assume we want to present participants with a word (either _black_ or _block_). The word is displayed really quickly, and we want to figure out the exact presentation time, at which a participant gets a response accuracy of 70%. This serves as a simplified example with no claim of relevance and important methodological considerations (e.g. stimulus masking) left out. Basic jsPsych knowledge is assumed.

### Terminology

We first briefly define some terms to prevent confusion.

A **presentation** is a set of jsPsych trials which includes at least the stimulus (here the word) and the response screen (fixation and masking would be part of a presentation as well).

A **cycle** is one run during which multiple presentations take place, and after which the performance is evaluated and the diffculty is adjusted. We might, e.g., present the participants with 10 words (randomly sampled, either _black_ or _block_), and then evaluate their accuracy. If the accuracy is higher than our target, the difficulty is increased, if it is lower, the difficulty is decreased.

The full **staircase procedure** consists of a certain number of cycles.

### Example

Install the library:

```
$ yarn add @kogpsy/jspsych-staircase
```

Then import the `generateStaircaseTimeline()` function in your experiment file:

```javascript
import { generateStaircaseTimeline } from '@kogpsy/jspsych-staircase';
```

This function takes a configuration object and returns a jsPsych timeline object which you can add to your main timeline. We will now go through some basic configuration options. First we create a difficulty object:

```javascript
// The difficulty variable (in our example in milliseconds)
let difficulty = 80;
// And the difficulty object
const difficultyStaircase = {
  max: 1,
  min: 100,
  get: () => {
    return difficulty;
  },
  set: (value) => {
    difficulty = value;
  },
};
```

Note that bigger difficulty numbers do not always mean the tasks is more difficult. With presentation times, as in our example, a presentation time of 100ms is easier than a presentation time of 20ms. You can (and must) define your own difficulty scale by setting the `max` and `min` fields of the difficulty object.

Now we can create our _presentation_ and _cycle_ logic:

```javascript
// The stimulus trial (here just HTML displaying a word grabbed from timeline
// variables)
const stimulus = {
  type: HtmlKeyboardResponsePlugin,
  stimulus: () => {
    return `<p>${jsPsych.timelineVariable('word')}</p>`;
  },
  // The trial duration is set to the value of the difficulty (note that the
  // function is not called, but passed - it will get called at runtime).
  trial_duration: difficultyStaircase.get,
  post_trial_gap: 1000,
  choices: 'NO_KEYS',
};
// The response trial
const response = {
  type: HtmlKeyboardResponsePlugin,
  stimulus: `
    <p>
      Press [ F ] if you have read 'block' and [ J ] if you have read 'black'.
    </p>`,
  choices: ['f', 'j'],
  post_trial_gap: 500,
  on_finish: (data) => {
    // Important: you need to add a label to the trial data, so that
    // jspsych-staircase can identify the relevant trials to calculate accuracy.
    data.data_label = 'staircase';
    // Further we need to add a correct field, which holds true if the
    // participant responded correctly and false otherwise.
    const correctResponse = jsPsych.timelineVariable('correctResponse');
    data.correct = jsPsych.pluginAPI.compareKeys(
      data.response,
      correctResponse
    );
  },
};
// The cycle node. This presents the presentation (the above two trials) 5 times
// with the word 'black' and 5 times with the word 'block', in random order.
const cycle = {
  timeline: [stimulus, response],
  timeline_variables: [
    { word: 'black', correctResponse: 'j' },
    { word: 'block', correctResponse: 'f' },
  ],
  sample: {
    type: 'fixed-repetitions',
    size: 5,
  },
};
```

See the comments to learn what piece of this code does what exactly. If things remain unclear, it might be a good idea to read through the [jsPsych documentation][2].

## Configuration reference

## Development

Available scripts:

### `yarn run build`

Build and bundle the library with rollup. A JavaScript bundle as well as TypeScript declarations are placed in the `dist/` directory.

### `yarn run fmt`

Format the code with prettier. See `.prettierrc.json` for configuration options.

### `yarn run test`

Run tests with Jest. To add new tests, simply create a `*.test.ts` file containing Jest tests. Refer to the [Jest documentation][1] for an in-depth tutorial.

[1]: https://jestjs.io/docs/getting-started
[2]: https://www.jspsych.org/

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

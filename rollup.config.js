import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/lib.ts',
  output: [
    {
      name: 'jspsych-staircase',
      file: 'dist/jspsych-staircase.js',
      format: 'es',
    },
  ],
  plugins: [typescript()],
};

import ts from 'rollup-plugin-ts';

export default [
  {
    input: 'src/lib.ts',
    output: [
      {
        name: 'jspsych-staircase',
        file: 'dist/jspsych-staircase.js',
        format: 'es',
      },
    ],
    plugins: [ts()],
  },
];

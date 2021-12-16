import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      diagnostics: {
        // Suppress ts-jest warning about esModuleInterop
        ignoreCodes: ['TS151001'],
      },
    },
  },
};
export default config;

import { defineConfig } from 'orval';

export default defineConfig({
  userApi: {
    input: {
      target: './openapi.yaml',
    },
    output: {
      mode: 'single',
      target: './src/api/generated.ts',
      schemas: './src/api/model',
      client: 'react-query',
      mock: false,
      override: {
        mutator: {
          path: './src/api/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});

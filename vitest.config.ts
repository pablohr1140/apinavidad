import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  esbuild: {
    target: 'es2022',
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reports: ['text', 'html'],
      excludeAfterRemap: true
    }
  }
});

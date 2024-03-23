import fs from 'node:fs';
import path from 'node:path';

import { pnpmWorkspaceRoot as findWorkspaceDir } from '@node-kit/pnpm-workspace-root';
import react from '@vitejs/plugin-react';
import findPackageDir from 'pkg-dir';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(async () => {
  const PACKAGE_DIR = (await findPackageDir(process.cwd()))!;
  const WORKSPACE_DIR = (await findWorkspaceDir(process.cwd()))!;

  const OUTPUT_DIR = path.resolve(PACKAGE_DIR, './dist');

  const SEED_IMAGE_DIR = path.resolve(WORKSPACE_DIR, './workspaces/server/seeds/images');
  const IMAGE_PATH_LIST = fs.readdirSync(SEED_IMAGE_DIR).map((file) => `/images/${file}`);

  return {
    build: {
      outDir: OUTPUT_DIR,
      rollupOptions: {
        input: {
          client: path.resolve(PACKAGE_DIR, './src/index.tsx'),
          serviceworker: path.resolve(PACKAGE_DIR, './src/serviceworker/index.ts'),
        },
        output: {
          entryFileNames: '[name].js',
        },
      },
      sourcemap: true,
      target: ['chrome123'],
    },
    define: {
      'process.env.API_URL': JSON.stringify(''),
      'process.env.NODE_ENV': JSON.stringify(process.env['NODE_ENV'] || 'development'),
      'process.env.PATH_LIST': JSON.stringify(IMAGE_PATH_LIST.join(',') || ''),
    },
    plugins: [
      react(),
      nodePolyfills({
        globals: {
          process: false,
        },
        include: ['events', 'fs', 'path', 'buffer'],
      }),
    ],
  };
});

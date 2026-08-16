import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryName = 'super-suero-store';

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? `/${repositoryName}/` : '/',
});

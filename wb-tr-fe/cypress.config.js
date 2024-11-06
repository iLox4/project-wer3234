import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    experimentalShadowDomSupport: true,
    includeShadowDom: true,
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
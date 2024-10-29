import typescript from '@rollup/plugin-typescript'

export default {
  input: ['src/index.ts', 'src/deploy-commands.ts'],
  output: {
    dir: 'exports',
    format: 'es'
  },
  plugins: [typescript()]
}

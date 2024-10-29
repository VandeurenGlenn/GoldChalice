import typescript from '@rollup/plugin-typescript'
import { readdir } from 'fs/promises'
import { parse } from 'path'

let commands = await readdir('src/commands', { recursive: true })
commands = commands.filter((path) => parse(path).ext).map((command) => `src/commands/${command}`)

export default [
  {
    input: ['src/index.ts', 'src/deploy-commands.ts'],
    output: {
      dir: 'exports',
      format: 'es'
    },
    plugins: [typescript()]
  },
  {
    input: commands,
    output: {
      dir: 'exports/commands',
      format: 'es'
    },
    plugins: [typescript({ compilerOptions: { outDir: 'exports/commands' } })]
  }
]

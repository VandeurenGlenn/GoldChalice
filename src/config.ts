import { open } from 'fs/promises'

let config: { clientId: string; guildId: string; token: string }

try {
  const fd = await open('./config.json')
  config = JSON.parse(await fd.readFile({ encoding: 'utf-8' }))
  await fd.close()
} catch (error) {
  console.error('Error getting config.json file.')
  console.error('Please make sure the file exists and the path is correct.')
  throw error
}

export default config

import { SlashCommandBuilder } from 'discord.js'

export const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!')

export const execute = async (interaction) => interaction.reply('Pong!')

export default {
  data,
  execute
}

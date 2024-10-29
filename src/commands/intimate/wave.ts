import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
//.setImage('https://media1.tenor.com/m/jZjRUvd8J1UAAAAC/kiss-heart.gif');

export const data = new SlashCommandBuilder()
  .setName('wave')
  .setDescription('Waves to any user.')
  .addUserOption((option) => option.setName('waveto').setDescription('Who do you want to wave to?').setRequired(true))

export const execute = async (interaction) => {
  const target = interaction.options.getUser('waveto')
  const embed = new EmbedBuilder()
    .setColor(0xeedddd)
    .setTitle(`${interaction.user.globalName} waves at ${target.globalName}!`)
    .setDescription(`Heyy! ${target}`)
    .setImage('https://media.tenor.com/PBG8IAgoXvQAAAAi/hello-waving-frog.gif')

  await interaction.reply({ embeds: [embed] })
}
export default {
  data,
  execute
}

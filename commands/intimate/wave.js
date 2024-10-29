const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//.setImage('https://media1.tenor.com/m/jZjRUvd8J1UAAAAC/kiss-heart.gif');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wave')
		.setDescription('Select a member to wave to.')
		.addUserOption(option =>
			option
				.setName('waveto')
				.setDescription('Who do you want to wave to?')
				.setRequired(true)),
	async execute(interaction) {
		const target = interaction.options.getUser('waveto');
		const embed = new EmbedBuilder()
			.setColor(0xEEDDDD)
			.setTitle(`${interaction.user.globalName} waves at ${target.globalName}!`)
			.setDescription(`Heyy! ${target}`)
			.setImage('https://media.tenor.com/PBG8IAgoXvQAAAAi/hello-waving-frog.gif');

		await interaction.reply( { embeds: [embed] } );
	},
};
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poem')
        .setDescription('Its not about you its around you.'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor('#EEDDDD')
			.setImage('https://dl.openseauserdata.com/cache/originImage/files/632a2d617fefd6e4feca086a4a5b793a.png');
		await interaction.reply( { embeds: [embed] } );
	},
};// https://dl.openseauserdata.com/cache/originImage/files/632a2d617fefd6e4feca086a4a5b793a.png
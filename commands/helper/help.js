const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows command list.'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor(0xEEDDDD)
			.setTitle(`Gold Chalice Bot Help`)
			.setThumbnail('https://cdn.discordapp.com/attachments/1187246980993392731/1300293958924107776/GoldChaliceTransparent128.png?ex=6720509e&is=671eff1e&hm=532fa056863d1e290c7be291da53dcdad1e43548856a4fbf250dbc594f289e43&')
			.addFields(
				{ name: '/game', value: 'Starts the Gold Chalice Adventure. Use the "/game" command again to begin.'},
				{ name: '/trivia', value: 'Get a random trivia question.'},
				{ name: '/poem', value: 'Displays the You poem.'},
				{ name: '/user @someone', value: 'Displays user information.'},
				{ name: '/server', value: 'Displays server information.'},
				{ name: '/wave @someone', value: 'Waves to any user.'},
			)
			.setTimestamp()
			.setFooter({text: 'Trivia by TriviaDB. Gold Chalice Bot created by Toroid Games.', iconURL: 'https://cdn.discordapp.com/attachments/1187246980993392731/1300293958924107776/GoldChaliceTransparent128.png?ex=6720509e&is=671eff1e&hm=532fa056863d1e290c7be291da53dcdad1e43548856a4fbf250dbc594f289e43&'});

		await interaction.reply( { embeds: [embed] } );
	},
};
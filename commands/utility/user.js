const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The user to check')
				.setRequired(true)),
		async execute(interaction) {
			const target = interaction.options.getUser('target');
			console.log(target);
			await interaction.reply(`~
		Profile ${target}
		Id: ${target.id}
		Bot: ${target.bot}
		System: ${target.system}
		Flags.Bitfield: ${target.flags?.bitfield}
		Username: ${target.username}
		Globalname: ${target.globalName}
		Discriminator: ${target.discriminator}
		Avatar: ${target.avatar}
		Banner: ${target.banner}
		Accent Color: ${target.accentColor}
		Avatar Decoration: ${target.avatarDecoration}
		Avatar Decoration Data: ${target.avatarDecorationData}
		`);
	},
};
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const gm = require('./../../objbank/gamemanager.js');
//console.log(gm.player);
//console.log(gm.look(gm.player));
let dbp;
module.exports = {
	data: new SlashCommandBuilder()
		.setName('game')
		.setDescription('Starts Gold Chalice game!'),
	async execute(interaction) {
    try
    {
      const { id, username } = interaction.user;
      //gm.retrieveAllDBPlayers();
      dbp = await gm.getThisPlayer(id, username);
    }        
    catch (error) {
      console.error('Error: ', error.message);
      const embed = new EmbedBuilder()
      .setTitle('Game.js getThisPlayer Error')
      .setDescription(error.message)
      .setColor(0xFF0000); // Red color for error
      
      await interaction.reply({ embeds: [embed] });
    }
    // hmm
    console.log('Game.js dbp', dbp);
    try
    {
      await gm.runGame(interaction, dbp);
    }
    catch (error){
      console.error('Error: ', error.message);
      const embed = new EmbedBuilder()
      .setTitle('Game.js runGame Error')
      .setDescription(error.message)
      .setColor(0xFF0000); // Red color for error
      
      await interaction.reply({ embeds: [embed] });
    }
	},
};
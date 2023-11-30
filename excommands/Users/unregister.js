const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const fs2 = require('../../fsfuncs')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('unregister')
		.setDescription('Deletes your user data'),
	async execute(interaction) {
		if (interaction.channel.id !== "923290922010177616"){
		const userpath = path.join(__dirname, '../../../wfbots/userdata', `${interaction.member.id}.json`); // defining the user path
		if (await fs2.exists(userpath)) { // verifying presence of the user data
			await fs2.unlink(userpath); // deleting the user data
			await interaction.reply({ content: "Your user data has been successfully deleted!", ephemeral: true });
		}
		else
		{
			await interaction.reply({ content: "Your user data does not exist so we could not delete it!", ephemeral: true });
		}
	}
	}
};
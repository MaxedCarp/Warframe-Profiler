const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('node:path');
const fs2 = require('../../fsfuncs')
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('setmr')
		.setDescription('Sets your Mastery Rank level.')
		.addIntegerOption(option =>
            option.setName('mr')
                .setDescription('Your in-game Mastery Rank.')
                .setRequired(true)),
	async execute(interaction) {
		const mr = interaction.options.getInteger('mr');
		if (mr < 35 && mr > -1){
			const userpath = path.join(__dirname, '../../../wfbots/userdata', `${interaction.member.id}.json`); // defining the user path
			const exist = await fs2.exists(userpath);
			if (await exist) {
				let obj = JSON.parse(await fs2.readFile(userpath));
				obj.mr = mr;
				await fs2.writeFile(userpath, JSON.stringify(obj, null, "\t"));
				await interaction.reply( { content: `Your Mastery Rank has been successfully set to: ${obj.mr}!`, ephemeral: true} );
			}
			else
			{
				interaction.reply({ content: "You need to register first!", ephemeral: true });
			}
		}
		else
			interaction.reply({ content: 'Specified Mastery Rank has to be between 0 an 35!', ephemeral: true });
	}
};
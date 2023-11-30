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
		.setName('setign')
		.setDescription('Sets your In-Game name.')
		.addStringOption(option =>
            option.setName('ign')
                .setDescription('Your full in-game name, hashtag and 3 digits (can be found in your in-game profile.)')
                .setRequired(true)),
	async execute(interaction) {
		const reg = /^[^ ]+#\d{3}$/;
		const reg2 = /^.+#\d{3}$/;
		const ign = interaction.options.getString('ign');
		const userpath = path.join(__dirname, '../../../wfbots/userdata', `${interaction.member.id}.json`); // defining the user path
		const exist = await fs2.exists(userpath);
		if (await exist) {
			let obj = JSON.parse(await fs2.readFile(userpath));
			if (ign.match(reg) || (ign.match(reg2) && obj.platform === "xBox")){
				obj.ign = ign;
				await fs2.writeFile(userpath, JSON.stringify(obj, null, "\t"));
				await interaction.reply( { content: `Your in-game name has been successfully set to: ${obj.ign}!`, ephemeral: true} );
			}
			else
			{
				interaction.reply({ content: 'Please make sure your username end with a hashtag and 3 digits as per your ingame profile!\n(For your in-game profile, hover your name in the top left and click "Profile")', ephemeral: true });
			}
		}
		else
			interaction.reply({ content: 'You need to register first!', ephemeral: true });
	}
};
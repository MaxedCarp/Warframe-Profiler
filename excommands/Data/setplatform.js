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
		.setName('setplatform')
		.setDescription('Sets your platform.')
		.addStringOption(option =>
            option.setName('platform')
                .setDescription('The platform you play on.')
				.addChoices(
                    { name: 'PC', value: 'PC' },
                    { name: 'Playstation', value: 'Playstation' },
                    { name: 'XBox', value: 'XBox' },
                    { name: 'Switch', value: 'Switch' },
                )
                .setRequired(true)),
	async execute(interaction) {
		if (interaction.channel.id !== "923290922010177616"){
			const plat = interaction.options.getString('platform');
			const userpath = path.join(__dirname, '../../../wfbots/userdata', `${interaction.member.id}.json`); // defining the user path
			const exist = await fs2.exists(userpath);
			if (await exist) {
				let obj = JSON.parse(await fs2.readFile(userpath));
				obj.platform = plat;
				await fs2.writeFile(userpath, JSON.stringify(obj, null, "\t"));
				await interaction.reply( { content: `Your Platform has been successfully set to: ${obj.platform}!`, ephemeral: true} );
			}
			else
			{
				interaction.reply({ content: "You need to register first!", ephemeral: true });
			}
		}
	}
};
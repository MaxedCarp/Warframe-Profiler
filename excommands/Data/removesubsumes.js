const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('node:path');
const fs2 = require('../../fsfuncs');
const { rcfId, tsukiId, alli, sublist } = require('../../config.json');
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('removesubsumes')
		.setDescription('Removes the listed subsumed abilities from your profile page')
		.addStringOption(option =>
            option.setName('subsumes')
                .setDescription('List of subsumed abilities (separated by a command and a space)')
                .setRequired(true)),
	async execute(interaction) {
		if (interaction.channel.id !== "923290922010177616"){
			const userpath = path.join(__dirname, '../../../wfbots/userdata', `${interaction.member.id}.json`); // defining the user path
			const exist = await fs2.exists(userpath);
			if (exist) {
				let obj = JSON.parse(await fs2.readFile(userpath));
				const subl = interaction.options.getString('subsumes');
				const sublsplit = subl.toLowerCase().split(', ');
				let finalsubl = sublist.filter (i => sublsplit.indexOf(i.toLowerCase()) !== -1);
				const lower = obj.sublist.map(element => {
					return element.toLowerCase();
				});
				let nonexistentsubl = uniq(sublsplit.filter(i => lower.indexOf(i.toLowerCase()) === -1));
				for (i = 0; i < finalsubl.length; i++){
				obj.sublist = obj.sublist.filter(a => a !== finalsubl[i]);
				}
				uniq(obj.sublist.sort());
				await fs2.writeFile(userpath, JSON.stringify(obj, null, "\t"));
				if (finalsubl.length >= 1){
					const exampleEmbed = new EmbedBuilder()
						.setColor(0x69FA04)
						.setTitle(`The following subsumed abilities were removed from your profile:`)
						.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` });
					exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
					for (i = 0; i < finalsubl.length; i++){
						exampleEmbed.addFields({ name: finalsubl[i], value: "Removed!", inline: true });
					}
					await interaction.reply({ embeds: [exampleEmbed] });
				}
				if (nonexistentsubl.length >= 1){
					const exampleEmbed2 = new EmbedBuilder()
						.setColor(0xFF0000)
						.setTitle(`The following subsumed abilities were NOT removed from your profile:`)
						.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` });
					exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
					for (i = 0; i < nonexistentsubl.length; i++){
						exampleEmbed2.addFields({ name: nonexistentsubl[i], value: "This subumed ability either isn't a thing or it isn't in your profile!", inline: true });
					}
					if (interaction.replied || interaction.deferred){
						await interaction.followUp({ embeds: [exampleEmbed2] });
					}
					else
						await interaction.reply({ embeds: [exampleEmbed2] });
				}
			}
			else
				interaction.reply({ content: "You need to register first!", ephemeral: true });
		}
	}
};
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('node:path');
const fs2 = require('../../fsfuncs');
const { rcfId, tsukiId, sublist, alli } = require('../../config.json');
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('addsubsumes')
		.setDescription('Add the listed subsumed abilities to your profile page')
		.addStringOption(option =>
            option.setName('subsumes')
                .setDescription('List of subsumed abilities (separated by a comma followed by a space)')
                .setRequired(true)),
	async execute(interaction) {
		if (interaction.channel.id !== "923290922010177616"){
			const userpath = path.join(__dirname, '../../../wfbots/userdata', `${interaction.member.id}.json`); // defining the user path
			const exist = await fs2.exists(userpath);
			if (await exist) {
				let obj = JSON.parse(await fs2.readFile(userpath));
				const subl = interaction.options.getString('subsumes');
				const sublsplit = subl.toLowerCase().split(', ');
				let finalsubl = sublist.filter (i => sublsplit.indexOf(i.toLowerCase()) !== -1);
				const lower = sublist.map(element => {
					return element.toLowerCase();
				});
				finalsubl = uniq(finalsubl.filter(i => obj.sublist?.indexOf(i) === -1));
				let nonexistentsubl = uniq(sublsplit.filter(i => lower.indexOf(i.toLowerCase()) === -1));
				let alrlistedsubl = sublist.filter(i => sublsplit.indexOf(i.toLowerCase()) !== -1);
				alrlistedsubl = uniq(alrlistedsubl.filter(i => obj.sublist?.indexOf(i) !== -1));
				for (i = 0; i < finalsubl.length; i++){
				obj.sublist.push(finalsubl[i]);
				}
				uniq(obj.sublist.sort());
				await fs2.writeFile(userpath, JSON.stringify(obj, null, "\t"));
				if (finalsubl.length >= 1){
				const exampleEmbed = new EmbedBuilder()
					.setColor(0x69FA04)
					.setTitle(`The following subsumed abilities were added to your profile:`)
					.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` });
				exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
					for (i = 0; i < finalsubl.length; i++){
						exampleEmbed.addFields({ name: finalsubl[i], value: "Added!", inline: true });
					}
				await interaction.reply({ embeds: [exampleEmbed] });
				}
				if (nonexistentsubl.length >= 1 || alrlistedsubl.length >= 1){
					const exampleEmbed2 = new EmbedBuilder()
						.setColor(0xFF0000)
						.setTitle(`The following subsumed abilities were NOT added to your profile:`)
						.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` });
					exampleEmbed2.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
					for (i = 0; i < nonexistentsubl.length; i++){
						exampleEmbed2.addFields({ name: nonexistentsubl[i], value: "Does not exist!", inline: true });
					}
					for (i = 0; i < alrlistedsubl.length; i++){
						exampleEmbed2.addFields({ name: alrlistedsubl[i], value: "Already in your profile!", inline: true });
					}
					if (finalsubl.length >= 1)
						await interaction.followUp({ embeds: [exampleEmbed2] });
					else
						await interaction.reply({ embeds: [exampleEmbed2] });
				}
			}
			else
			{
				interaction.reply({ content: "You need to register first!", ephemeral: true });
			}
		}
	}
};
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('node:path');
const fs2 = require('../../fsfuncs');
const { rcfId, tsukiId, alli, framelist } = require('../../config.json');
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('removeframes')
		.setDescription('Removes the listed frames from your profile page')
		.addStringOption(option =>
            option.setName('frames')
                .setDescription('List of frames (separated by a command and a space)')
                .setRequired(true)),
	async execute(interaction) {
		if (interaction.channel.id !== "923290922010177616"){
			const userpath = path.join(__dirname, '../../../wfbots/userdata', `${interaction.member.id}.json`); // defining the user path
			const exist = await fs2.exists(userpath);
			if (exist) {
				let obj = JSON.parse(await fs2.readFile(userpath));
				const framel = interaction.options.getString('frames');
				const framelsplit = framel.toLowerCase().split(', ');
				let finalframel = framelist.filter (i => framelsplit.indexOf(i.toLowerCase()) !== -1);
				const lower = obj.framelist.map(element => {
					return element.toLowerCase();
				});
				let nonexistentframel = uniq(framelsplit.filter(i => lower.indexOf(i.toLowerCase()) === -1));
				for (i = 0; i < finalframel.length; i++){
					obj.framelist = obj.framelist.filter(a => a !== finalframel[i]);
				}
				uniq(obj.framelist.sort());
				await fs2.writeFile(userpath, JSON.stringify(obj, null, "\t"));
				if (finalframel.length >= 1){
					const exampleEmbed = new EmbedBuilder()
						.setColor(0x69FA04)
						.setTitle(`The following frames were removed from your profile:`)
						.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` });
					exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
					for (i = 0; i < finalframel.length; i++){
						exampleEmbed.addFields({ name: finalframel[i], value: "Removed!", inline: true });
					}
					await interaction.reply({ embeds: [exampleEmbed] });
				}
				if (nonexistentframel.length >= 1){
					const exampleEmbed2 = new EmbedBuilder()
						.setColor(0xFF0000)
						.setTitle(`The following frames were NOT removed from your profile:`)
						.setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.member.displayAvatarURL()}` })
					exampleEmbed2.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
					for (i = 0; i < nonexistentframel.length; i++){
						exampleEmbed2.addFields({ name: nonexistentframel[i], value: "This frame either isn't a thing or it isn't in your profile!", inline: true });
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
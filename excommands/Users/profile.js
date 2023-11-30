const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('node:path');
const fs2 = require('../../fsfuncs');
const { emb } = require('../../clanicons.json');
const { rcfId, tsukiId, alli } = require('../../config.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Prints out your profile')
		.addStringOption(option =>
            option.setName('mode')
                .setDescription('Extended mode displays frames and subsumed abilities.')
				.addChoices(
                    { name: 'Simple', value: 'simple' },
                    { name: 'Extended', value: 'extended' }
				)
            .setRequired(true))
		.addUserOption(option =>
            option.setName('user')
                .setDescription('User to check the profile for')),
	async execute(interaction) {
		if (interaction.channel.id !== "923290922010177616"){
		const user = interaction.options.getUser('user');
		const userpath = path.join(__dirname, '../../../wfbots/userdata', `${(user?.id ||interaction.member.id)}.json`); // defining the user path
		const exist = await fs2.exists(userpath);
		if (await exist) {
			let obj = JSON.parse(await fs2.readFile(userpath));
		    const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${obj.ign}'s Profile`)
				.setAuthor({ name: `${(user?.displayName || interaction.user.displayName)}`, iconURL: `${(user?.displayAvatarURL() || interaction.member.displayAvatarURL())}` })
                .addFields(
				//{ name: `In-Game Name`, value: obj.ign, inline: true },
				{ name: `Mastery Rank`, value: "" + obj.mr, inline: true },
				);
			if (obj.clan !== ""){
				exampleEmbed.addFields({ name: `Clan`, value: obj.clan, inline: true });
				exampleEmbed.setThumbnail(emb[obj.clan]);
			}
			exampleEmbed.addFields({ name: `Platform`, value: obj.platform, inline: true });
			const mode = interaction.options.getString('mode');
			if (obj.mains.length > 0)
				exampleEmbed.addFields({ name: `Main(s) (${obj.mains.length})`, value: obj.mains.sort().toString().replaceAll(',', ', ') });
			if (mode === "extended") {
				if (obj.framelist.length > 0)
				{
					var ls = obj.framelist.filter(a => !a.includes("Prime"));
					var count = ls.length;
					var ls2 = ls.sort().toString();
					let n = 4;
					let ch = ',';

					let regex = new RegExp("((?:[^" +ch+ "]*" +ch+ "){" + (n-1) + "}[^" +ch+ "]*)" +ch, "g");

					ls2 = ls2.replace(regex, '$1,\n');
					if (ls.length > 0)
						exampleEmbed.addFields({ name: `Frames (${ls.length} / 54)`, value: ls2.replaceAll(',', ', ') });
					ls = obj.framelist.filter(a => !!a.includes("Prime"));
					count += ls.length;
					ls2 = ls.sort().toString();
					ls2 = ls2.replace(regex, '$1,\n');
					if (ls.length > 0)
						exampleEmbed.addFields({ name: `Prime Frames (${ls.length} / 40)`, value: ls2.replaceAll(',', ', ') });
					
					exampleEmbed.addFields({ name: `Total Frame Count`, value: `${count}` });
				}
				if (obj.sublist.length > 0)
				{
					var ls = obj.sublist;
					ls = ls.sort().toString();
					let n = 4;
					let ch = ',';

					let regex = new RegExp("((?:[^" +ch+ "]*" +ch+ "){" + (n-1) + "}[^" +ch+ "]*)" +ch, "g");

					ls = ls.replace(regex, '$1,\n');

					exampleEmbed.addFields({ name: `Subsumed Abilities (${obj.sublist.length} / 54)`, value: ls.replaceAll(',', ', ') });
				}
			}
			exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
			await interaction.reply({ embeds: [exampleEmbed] });
		}
		else
		{
			txt = (user) ? user + "'s " : "Your user ";
			interaction.reply({ content: `${txt}data does not exist! Please /register to create it!`, ephemeral: true })
		}
	}
	}
};
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('node:path');
const fs2 = require('../../fsfuncs');
const { rcfId, tsukiId, alli } = require('../../config.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Registers the user')
		.addStringOption(option =>
            option.setName('ign')
                .setDescription('Your full in-game name, hashtag and 3 digits (can be found in your in-game profile.)')
                .setRequired(true))
		.addIntegerOption(option =>
            option.setName('mr')
                .setDescription('Your in-game Mastery Rank.')
                .setRequired(true))
		.addStringOption(option =>
            option.setName('platform')
                .setDescription('The platform you play on.')
				.addChoices(
                    { name: 'PC', value: 'PC' },
                    { name: 'Playstation', value: 'Playstation' },
                    { name: 'XBox', value: 'xBox' },
                    { name: 'Switch', value: 'Switch' },
                )
                .setRequired(true)),
	async execute(interaction) {
		const reg = /^[^ ]+#\d{3}$/;
		const reg2 = /^.+#\d{3}$/;
		const userpath = path.join(__dirname, '../../../wfbots/userdata', `${interaction.member.id}.json`); // defining the user path
		const exist = await fs2.exists(userpath);
		if (await !!!exist) {
			const platform = interaction.options.getString('platform');
			const clan = interaction.options.getString('clan');
			const ign = interaction.options.getString('ign');
			if (ign.match(reg) || (ign.match(reg2) && platform === "xBox")){
				const MR = interaction.options.getInteger('mr');
				if (MR < 35 && MR > -1){
					let obj = {"ign": ign, "mr": MR, "platform": platform, "clan": "", "mains": [], "framelist": [], "sublist": []};
					await fs2.writeFile(userpath, JSON.stringify(obj, null, "\t"));
					const exampleEmbed = new EmbedBuilder()
						.setColor(0x0099FF)
						.setTitle(`User Registered: ${interaction.user.username} (${interaction.user.displayName})`)
						.addFields(
						{ name: `In-Game Name: `, value: ign },
						{ name: `Mastery Rank: `, value: "" + MR },
						{ name: `Platform: `, value: platform }
						);
						exampleEmbed.setFooter({ text: alli[interaction.applicationId][0], iconURL: alli[interaction.applicationId][1] });
					await interaction.reply({ embeds: [exampleEmbed] });
				}
				else
					interaction.reply({ content: 'Specified Mastery Rank has to be between 0 an 35!', ephemeral: true });
			}
			else {
				interaction.reply({ content: 'Please make sure your username end with a hashtag and 3 digits as per your ingame profile!\n(For your in-game profile, hover your name in the top left and click "Profile")', ephemeral: true });
			}
		}
		else
		{
			interaction.reply({ content: "Your user data already exists! Please use /unregister in order to delete it before recreating it!", ephemeral: true })
		}
	}
};
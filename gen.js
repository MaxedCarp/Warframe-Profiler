const { Client, Collection, Events, GatewayIntentBits, Partials, EmbedBuilder, ActivityType } = require('discord.js');
const { REST, Routes } = require('discord.js');
const { genId, genToken } = require('./config.json');
const fs = require('fs');
const fs2 = require('./fsfuncs');
const path = require('node:path');
const client = new Client({ intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions], partials: [Partials.Channel, Partials.Message, Partials.Reaction] });
fetched = false;
client.once(Events.ClientReady, async c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	await client.user.setPresence({ activities: [{ name: `Bot started up!`, type: ActivityType.Custom }], status: 'dnd' });
	await sleep(3);
	while (true){
		var registeredc = await fs2.readdir("../wfbots/userdata");
		await client.user.setPresence({ activities: [{ name: `Registered Users: ${registeredc.length}`, type: ActivityType.Custom }], status: 'dnd' });
		await sleep(5);
		let mC = client.guilds.cache.filter(a => a.id !== "603685659797880832").map(guild => guild.memberCount).reduce((a, b) => a + b, 0);
		await client.user.setPresence({ activities: [{ name: `${mC} members in all servers!`, type: ActivityType.Custom }], status: 'dnd' });
		await sleep(5);
		await client.user.setPresence({ activities: [{ name: `Awaiting a /register!`, type: ActivityType.Custom }], status: 'dnd' });
		await sleep(5);
		await client.user.setPresence({ activities: [{ name: `Looking forward to a /profile!`, type: ActivityType.Custom }], status: 'dnd' });
		await sleep(5);
		await client.user.setPresence({ activities: [{ name: `Suggest ideas or give feedback in: https://discord.gg/xpBaH8DnYy`, type: ActivityType.Custom }], status: 'dnd' });
		await sleep(5);
		let totalSeconds = (client.uptime / 1000);
		let days = Math.floor(totalSeconds / 86400);
		totalSeconds %= 86400;
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.floor(totalSeconds % 60);
		await client.user.setPresence({ activities: [{ name: `Uptime: ${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`, type: ActivityType.Custom }], status: 'dnd' });
		await sleep(5);
		await client.user.setPresence({ activities: [{ name: `/help for command help`, type: ActivityType.Custom }], status: 'dnd' });
		await sleep(5);
	}
});


client.login(genToken);

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'excommands');
const commandFolders = fs.readdirSync(foldersPath);
function sleep(seconds) {
  return new Promise(r => setTimeout(r, seconds * 1000))
}
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	const sub = (interaction.options["_subcommand"] ? " " + interaction.options["_subcommand"] : "");
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'This interaction was already replied to!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
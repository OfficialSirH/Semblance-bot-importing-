import type { Semblance } from "@semblance/src/structures";
import { MessageEmbed, Constants, MessageActionRow, MessageButton } from "discord.js";
import type { Message, GuildChannel, TextBasedChannels } from 'discord.js';
import config from '@semblance/config';
import { 
	getPermissionLevel,
	parseArgs,
	dontDisturb, 
	removeAfk, 
	trelloLinkRegex
} from '@semblance/constants';
import { Information } from '@semblance/models';
import { createBoosterRewards } from "@semblance/src/constants/models";
const { Events } = Constants;
const { sirhId, prefix, c2sGuildId, sirhGuildId } = config;

export default {
	name: Events.MESSAGE_CREATE,
	exec: (message: Message, client: Semblance) => messageCreate(message, client)
};

export const messageCreate = async (message: Message, client: Semblance) => {
    checkForGitHubUpdate(message);
	checkForTacoPost(message);
	if (message.channel.type == 'DM') return client.emit('messageDM', message);
	if (message.author.bot) return;
	if (message.member) {
		if (message.mentions.users && message.member.id != client.user.id) {
			dontDisturb(message, message.mentions.users);
		}
	}

    const { commands, aliases, autoCommands } = client;

	if (!message.content.toLowerCase().startsWith(`${prefix}afk`)) removeAfk(client, message);
	for (const [key, value] of Object.entries(autoCommands)) autoCommands[key].run(client, message, parseArgs(message.content));
	//Cell to Singularity Exclusive Code
	let chName = message.channel.name;
	
	if (message.guild.id == c2sGuildId) {
		if (chName == 'booster-chat' && message.type == 'USER_PREMIUM_GUILD_SUBSCRIPTION') return createBoosterRewards(message);
		let msg = message.content.toLowerCase(), suggestionArray = ["suggestion:", "suggest:", `${prefix}suggestion`, `${prefix}suggest`],
			suggestionRegex = new RegExp(`^(?:${prefix})?suggest(?:ions|ion)?:?`, 'i');
		
		if (msg.includes('beyond') && !msg.includes(`${prefix}beyond`)) updateBeyondCount();

		if (chName == 'suggestions') {
			if (suggestionRegex.exec(msg) != null || getPermissionLevel(message.member) > 0) return;
			else {
				message.delete();
				let embed = new MessageEmbed()
					.setTitle("Your Suggestion")
					.setDescription(`\`${message.content}\``);
				message.author.send({ content: `Your message in ${message.channel} was deleted due to not having the ` +
					`suggestion-prefix required with suggestions, which means your message ` +
					`*must* start with ${suggestionArray.map(t => `\`${t}\``).join(', ')}. The ` +
					`reason for the required suggestion-prefixes is to prevent the channel ` +
					`getting messy due to conversations instead of actual suggestions.`, embeds: [embed] });
			}
		}
		if (chName == 'share-your-prestige' && message.attachments.size == 0 && getPermissionLevel(message.member) == 0) message.delete();
		if (chName != 'semblance' && getPermissionLevel(message.member) == 0) return;
	}
	if (message.guild.id == sirhGuildId) {
		if (chName != 'bot-room' && chName != 'semblance-beta-testing' && getPermissionLevel(message.member) == 0) return;
	}
	//End of Cell to Singularity Exclusive Code
	if (message.mentions) {
		let msgMention = message.content.replace(/!/g, "");
		if ((msgMention == `<@${client.user.id}> ` || msgMention == `<@${client.user.id}>`) && message.member.id != client.user.id) {
			message.reply(`My command prefix is ${prefix}, which you can start off with ${prefix}help for all of my commands. :D`);
			return;
		}
	}
	
	//commands start here
	if (message.content.toLowerCase().startsWith(prefix) || message.content.match(`^<@!?${client.user.id}> `)) {
		let splitContent = message.content.split(" ")
		if (splitContent[0].match(`^<@!?${client.user.id}>`)) splitContent.shift(); else splitContent = message.content.slice(prefix.length).split(" ")
		const identifier = splitContent.shift().toLowerCase(), command = aliases[identifier] || identifier;
		let content = splitContent.join(" ")
		const commandFile = commands[command]
		if (!commandFile) return;
		if (commandFile.category == 'dm') { 
			return message.reply('DM commands go in DMs(DM = Direct Message).');
		}
		let permissionLevel: number;
		const args = parseArgs(content); try { permissionLevel = getPermissionLevel(message.member);
		} catch (e) { permissionLevel = (message.author.id == sirhId) ? 7 : 0 }
		//console.log(`${message.member}: ${permissionLevel}`);
		try { if (permissionLevel < commandFile.permissionRequired) return message.channel.send("❌ You don't have permission to do this!");
			if (!commandFile.checkArgs(args, permissionLevel, content)) return message.channel.send(`❌ Invalid arguments! Usage is \`${prefix}${command}${Object.keys(commandFile.usage).map(a => " " + a).join("")}\`, for additional help, see \`${prefix}help\`.`) as unknown as void;
			commandFile.run(client, message, args, identifier, { permissionLevel, content });
			console.log(command + " Called by " + message.author.username + " in " + message.guild.name);
		} catch (e) { }
	}
}

	/*
	* Check for GitHub updates
	*/

	function checkForGitHubUpdate(message: Message) {
		if ((message.channel as GuildChannel).name == 'semblance-updates' && message.guild.id == sirhGuildId && message.author.username == 'GitHub' && message.embeds[0].title.includes('master'))
			return Information.findOneAndUpdate({ infoType: "github" }, { $set: { info: message.embeds[0].description, updated: true } });
	}

	function checkForTacoPost(message: Message) {
		if (message.channel.id != '794054990020739113' || message.author.id != '620126394390675466') return;
		const embed = message.embeds[0];
		const { title, description } = embed;
		const link = trelloLinkRegex.exec(description)[0];
		(message.client.channels.cache.get('900050244857921587') as TextBasedChannels).send({
			content: title,
			components: [new MessageActionRow()
			.addComponents([new MessageButton()
				.setLabel('View on Trello')
				.setStyle('LINK')
				.setURL(link)
			])]
		});
	}

	async function updateBeyondCount() {
		const beyondCount = await Information.findOne({ infoType: 'beyondcount' });
		await Information.findOneAndUpdate({ infoType: 'beyondcount' }, { $set: { count: ++beyondCount.count } });
	}
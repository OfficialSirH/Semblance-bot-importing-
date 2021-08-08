import { Information } from '@semblance/models';
import { MessageEmbed, TextChannel, Constants, Presence } from 'discord.js';
import config from '@semblance/config';
import { Semblance, Webhook } from '@semblance/src/structures';
import {
    checkReminders,
    randomColor
} from '@semblance/constants';
import { intervalPost } from '..';
import { checkBoosterRewards } from '@semblance/src/constants/models';
const { c2sGuildId, prefix } = config;
const { Events } = Constants;

export default {
    name: Events.CLIENT_READY,
    once: true,
    exec: (client: Semblance) => ready(client)
}

export const ready = async (client: Semblance) => {
    console.log(`Logged in as ${client.user.tag}!`);

    Webhook.client = client;

    setInterval(() => {
        let totalMembers = client.guilds.cache.map(g => g.memberCount).filter(g => g).reduce((total, cur, ind) => total += cur, 0);
        const activity = `${prefix}help in ${client.guilds.cache.size} servers | ${totalMembers} members`;
        if (((client.user as any).presence as Presence).activities[0]?.name !== activity) client.user.setActivity(activity, { type: "WATCHING" });
    }, 30000);

    /* Slash Command setup */
    let slash_commands = await client.application.commands.fetch();
    slash_commands.forEach(command => client.slashCommands.set(command.id, require(`@semblance/src/slash_commands/${command.name}.js`)));

    /*
    * Reminder check
    */

    setInterval(() => { checkReminders(client) }, 60000);
    setInterval(() => { checkBoosterRewards(client) }, 1000 * 60 * 60 * 12);

    Information.findOne({ infoType: "github" })
        .then(async (infoHandler) => {
            if (infoHandler.updated) {
                await Information.findOneAndUpdate({ infoType: "github" }, { $set: { updated: false } }, { new: true });
                let embed = new MessageEmbed()
                    .setTitle("Semblance Update")
                    .setColor(randomColor)
                    .setAuthor(client.user.tag, client.user.displayAvatarURL())
                    .setDescription(`**${infoHandler.info}**`);

                (client.guilds.cache.get(c2sGuildId).channels.cache.find(c => c.name == 'semblance') as TextChannel).send({ embeds: [embed] });
            }
        });
    
    await client.initializeLeaderboards();
    intervalPost(client);
}
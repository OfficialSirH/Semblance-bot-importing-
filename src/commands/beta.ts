import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { currentLogo } from '#config';
import { randomColor } from '#constants/index';
import type { Command } from '#lib/interfaces/Semblance';
import type { SapphireClient } from '@sapphire/framework';

export default {
  description: 'Get info on the latest beta.',
  category: 'game',
  subcategory: 'other',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message) => run(client, message),
} as Command<'game'>;

const run = async (client: SapphireClient, message: Message) => {
  const infoHandler = await client.db.information.findUnique({ where: { type: 'beta' } });
  const embed = new Embed()
    .setTitle('Beta')
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .setDescription(infoHandler.value)
    .setFooter({ text: 'New stuff do be epicc' });
  message.channel.send({ embeds: [embed], files: [currentLogo] });
};

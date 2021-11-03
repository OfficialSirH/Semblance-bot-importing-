import type { SlashCommand } from '#lib/interfaces/Semblance';
import { MessageActionRow, MessageSelectMenu } from 'discord.js';

export default {
  permissionRequired: 0,
  run: async (interaction, { options, client }) => {
    const query = options.getString('query');
    if (!client.infoBuilders.has(query)) {
      const allQueries = client.infoBuilders.map((_, i) => i);
      const components = allQueries.reduce((acc, cur, i) => {
        const index = Math.floor(i / 25);
        if (!acc[index])
          acc[index] = new MessageActionRow().addComponents(
            new MessageSelectMenu()
              .setCustomId(
                JSON.stringify({
                  command: 'help',
                  action: `query-${index}`,
                  id: interaction.user.id,
                }),
              )
              .setPlaceholder('Select a query'),
          );
        (acc[index].components[0] as MessageSelectMenu).addOptions({ label: cur, value: cur });
        return acc;
      }, [] as MessageActionRow[]);
      return interaction.reply({
        content: "Your query was invalid, here's a select menu listed with valid queries!",
        components,
      });
    }
    const info = await client.infoBuilders.get(query)(interaction, client);
    interaction.reply(info);
  },
} as SlashCommand;

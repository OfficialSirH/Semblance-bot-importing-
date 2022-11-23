import { type ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType } from 'discord.js';
import { Category, randomColor } from '#constants/index';
import { Command, type ApplicationCommandRegistry } from '@sapphire/framework';

export default class Avatar extends Command {
  public override name = 'avatar';
  public override description = 'Get the avatar of a user.';
  public override fullCategory = [Category.utility];

  public async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
    const user = interaction.options.getUser('user')
        ? await this.container.client.users.fetch(interaction.options.getUser('user', true).id)
        : interaction.member.user,
      author = interaction.member.user,
      embed = new EmbedBuilder()
        .setTitle(`${user.username}'s Avatar`)
        .setAuthor({ name: `${author.tag}`, iconURL: author.displayAvatarURL() })
        .setColor(randomColor)
        .setImage(user.displayAvatarURL());
    return interaction.reply({ embeds: [embed] });
  }

  public registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand({
      name: this.name,
      description: this.description,
      options: [
        {
          name: 'user',
          type: ApplicationCommandOptionType.User,
          description: 'The user to get the avatar of.',
        },
      ],
    });
  }
}

import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { geodeImage, currentLogo } from '#config';
import { Command } from '@sapphire/framework';
import { Categories, Subcategories } from '#constants/index';

export default class Geodes extends Command {
  public override name = 'geodes';
  public override description = 'Get geode comparisons to show the best value.';
  public override fullCategory = [Categories.game, Subcategories.mesozoic];

  public override sharedRun(builder: Command['SharedBuilder']) {
    const user = 'user' in builder ? builder.user : builder.author;
    const embed = new Embed()
      .setTitle('Geodes Comparison')
      .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
      .setThumbnail(currentLogo.name)
      .setImage(geodeImage.name)
      .setDescription(
        'The top row of the image represents the rewards from each geode at rank 50, ' +
          'while the bottom row represents the geode rewards at rank 4, ' +
          "which rank 4 is shown instead of 1 because the diamond geode isn't unlocked until rank 4. " +
          "By the shown results within this image, it's highly recommended to get geodes at rank 50 for the greatest rewards for the same price as rank 4.",
      )
      .setFooter({ text: 'Diamond Geodes for da win!' });
    return { embeds: [embed], files: [currentLogo, geodeImage] };
  }

  public override async messageRun(message: Message) {
    await message.reply(this.sharedRun(message));
  }
}

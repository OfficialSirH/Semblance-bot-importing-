import { EmbedBuilder } from 'discord.js';
import { Command } from '#structures/Command';
import { Category, Subcategory, attachments } from '#constants/index';

export default class Geodes extends Command {
  public override name = 'geodes';
  public override description = 'Get geode comparisons to show the best value.';
  public override category = [Category.game, Subcategory.mesozoic];

  public override sharedRun(interaction: Command['SharedBuilder']) {
    const embed = new EmbedBuilder()
      .setTitle('Geodes Comparison')
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setThumbnail(attachments.currentLogo.name)
      .setImage(attachments.geodeLevelComparison.name)
      .setDescription(
        'The top row of the image represents the rewards from each geode at rank 50, ' +
          'while the bottom row represents the geode rewards at rank 4, ' +
          "which rank 4 is shown instead of 1 because the diamond geode isn't unlocked until rank 4. " +
          "By the shown results within this image, it's highly recommended to get geodes at rank 50 for the greatest rewards for the same price as rank 4.",
      )
      .setFooter({ text: 'Diamond Geodes for da win!' });
    return {
      embeds: [embed],
      files: [attachments.currentLogo.attachment, attachments.geodeLevelComparison.attachment],
    };
  }
}

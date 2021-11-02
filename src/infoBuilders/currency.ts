import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import config from '#config';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';

export const build: QueriedInfoBuilder = interaction => {
  const {
    currentLogo,
    entropy,
    idea,
    metabit,
    darwinium,
    fossil,
    mutagen,
    stardust,
    darkMatter,
    sentience,
    energy,
    currency,
  } = config;
  const embed = new MessageEmbed()
    .setTitle('Currency')
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL())
    .setColor(randomColor)
    .setThumbnail(currentLogo.name)
    .addFields(
      {
        name: `${entropy} Entropy`,
        value: 'The beginning currency in the game, which is used to for evolution upgrades',
      },
      {
        name: `${idea} Idea`,
        value: 'A resource unlocked further in the game, which is used for technological advancements',
      },
      {
        name: `${metabit} Metabit`,
        value:
          'Prestige(main sim) currency that is unlocked after reaching singularity for the first time, this currency is used for upgrades in the Reality Engine and gives a boost in productivity the more you gain.',
      },
      {
        name: `${darwinium} Darwinium`,
        value: 'A resource used for boosts and geodes (diamond geode is very useful to build up for)',
      },
      {
        name: `${fossil} Fossils`,
        value: 'The main resource in the Mesozoic Valley to upgrade dinosaurs',
      },
      {
        name: `${mutagen} Mutagen`,
        value:
          'The resource in the Mesozoic Valley used for upgrading trait cards is gained through opening geodes and upgrading dinosaurs, which you can also purchase with darwinium.',
      },
      {
        name: `${stardust} Stardust`,
        value: '"Build **The Universe**" - generated by Celestial Bodies',
      },
      {
        name: `${darkMatter} Dark Matter`,
        value: '"Build **The Universe**" - generated by Celestial Bodies',
      },
      {
        name: `${sentience} Sentience`,
        value: '"Expand **Consciousness**" - generated by Colonies',
      },
      {
        name: `${energy} Energy`,
        value: '"Expand **Consciousness**" - generated by Colonies',
      },
    )
    .setImage(currency.name)
    .setFooter('Thanks to Off Pringles#8141 for making this visual representation of currency');
  return { embeds: [embed], files: [currentLogo, currency] };
};

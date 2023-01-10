import { type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { applicationCommandToMention, Category, randomColor, Subcategory } from '#constants/index';
import { Command } from '#structures/Command';

export default class Secrets extends Command {
  public override name = 'secrets';
  public override description = 'secrets';
  public override category = [Category.game, Subcategory.other];

  public override async chatInputRun(res: FastifyReply, interaction: APIApplicationCommandInteraction) {
    const embed = new EmbedBuilder()
      .setTitle('Secret Achievements')
      .setColor(randomColor)
      .setDescription(
        [
          '1. Make an ape dab by tapping on it numerous times.',
          '2. Make an archosaur, named Archie, dance by tapping the archosaur with a tuxedo/suit.',
          `3. Unlock all sharks, *check ${applicationCommandToMention({
            client: this.client,
            commandName: 'help',
          })} and input 'sharks' into the option*.`,
          '**Land Garden:**',
          '4. Click the paradise bird, an all brown bird with a blue face.',
          '5. While your game camera is still focused on the paradise bird, wait till the bird flies near a small island with the darwin bust statue and click the island.',
          "6. In the savannah section of the land garden, activate camera mode and point the camera to top down so then you can see the top of the mountain ledges, near the lions and elephants you'll find... *sniff*... Archie's bones :(",
          "7. Between the savannah and the jungle section where the river splits them apart, you'll find the Amazonian Dolphin.",
          "8. If you have your camera positioned at the pond with the ducks at an angle pointing towards the left side of the mountain, you'll see a **Tibetan Fox** on the other side of the waterfall from the Ibex.",
          'You can also see the fox on the right side of the mountain if you have your camera positioned behind the 2 humans.',
          '9. Buy Disco Flatworms from the logit shop and tap on the flatworms to make them dance.',
          '**Speedrunning:**',
          '10. Reach Singularity within 5 minutes.',
          '11. Reach Singularity within 120 seconds!',
          '**Global**',
          '12. Find all of the dodos: https://discord.com/channels/488478892873744385/488478893586645004/1034451108216713307',
        ].join('\n'),
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  public override data() {
    return {
      command: { name: this.name, description: this.description },
    };
  }
}

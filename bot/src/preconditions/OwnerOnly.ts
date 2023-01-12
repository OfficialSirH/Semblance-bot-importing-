import { UserId } from '#constants/index';
import { Precondition } from '#structures/Precondition';
import type { APIChatInputApplicationCommandInteraction, APIContextMenuInteraction } from '@discordjs/core';
export class OwnerOnly extends Precondition {
  public override chatInputRun(interaction: APIChatInputApplicationCommandInteraction) {
    return [UserId.aditya, UserId.sirh].includes(interaction.user?.id as UserId)
      ? this.ok()
      : this.error('Only the bot owner can use this command!');
  }

  public override contextMenuRun(interaction: APIContextMenuInteraction) {
    return [UserId.aditya, UserId.sirh].includes(interaction.user?.id as UserId)
      ? this.ok()
      : this.error('Only the bot owner can use this command!');
  }
}

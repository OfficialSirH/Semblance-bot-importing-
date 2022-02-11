import type { SapphireClient } from '@sapphire/framework';

export class LeaderboardUtilities {
  public static async topTwenty(client: SapphireClient, type: 'game' | 'vote'): Promise<string> {
    if (type === 'game')
      return (
        await client.db.game.findMany({
          take: 20,
          orderBy: {
            level: 'desc',
          },
        })
      ).reduce((acc, cur, index) => `${acc}\n${index + 1}. <@${cur.player}> - level ${cur.level}`, '');

    return (
      await client.db.vote.findMany({
        take: 20,
        orderBy: {
          voteCount: 'desc',
        },
      })
    ).reduce((acc, cur, index) => `${acc}\n${index + 1}. <@${cur.userId}> - level ${cur.voteCount}`, '');
  }
}

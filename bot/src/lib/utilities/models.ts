import { emojis, formattedDate, GuildId, UserId } from '#lib/utilities/index';
import { sendMessage } from '#lib/utils/resolvers';
import { MessageFlags, Routes, type APIDMChannel, type APIGuildMember, type APIInteractionResponseCallbackData } from '@discordjs/core';
import type { BoosterCodes, BoosterReward, Reminder, UserReminder } from '@prisma/client';
import { scheduleJob } from 'node-schedule';

// BoosterRewards - handle finished booster rewards
export const handleBoosterReward = async (client: Client, boosterReward: BoosterReward) => {
	const member = (await client.rest
		.get(Routes.guildMember(GuildId.cellToSingularity, boosterReward.userId))
		.catch(() => null)) as APIGuildMember | null;
	if (!member || !member.roles.includes(boosterRoleId)) return container.prisma.boosterReward.delete({ where: { userId: boosterReward.userId } });

	const darwiniumCodes = await container.prisma.boosterCodes.findMany({});

	if (darwiniumCodes.length == 0) {
		await sendMessage(client, boosterChannelId, {
			content: `<@${UserId.sirh}> <@${UserId.aditya}> No booster codes left! ${member.user?.username}#${member.user?.discriminator} (${member.user?.id}) needs a code`,
			allowed_mentions: { users: [UserId.sirh, UserId.aditya] }
		});

		return container.prisma.boosterReward.update({
			where: { userId: boosterReward.userId },
			data: { rewardingDate: new Date(Date.now() + 1000 * 3600 * 24 * 28) }
		});
	}

	const ogCodeLength = darwiniumCodes.length;
	const darwiniumCode = darwiniumCodes.shift() as BoosterCodes;

	const dmChannel = (await client.rest.post(Routes.userChannels(), {
		body: {
			recipient_id: member.user?.id
		}
	})) as APIDMChannel | null;
	sendMessage(client, dmChannel?.id as string, {
		content: `Thank you for boosting Cell to Singularity for a month! As a reward, here's 120 ${emojis.darwinium}!\nCode: ||${darwiniumCode.code}||`
	}).catch(async (err) => {
		client.logger.warn(
			`There was an issue with sending the code to ${member.user?.username}#${member.user?.discriminator} (${member.user?.id}): ${err}`
		);

		await sendMessage(client, boosterChannelId, {
			content: `${member} I had trouble DMing you so instead Aditya or SirH will manually provide you a code. :)`,
			allowed_mentions: { users: [member.user?.id as string] }
		});

		darwiniumCodes.unshift(darwiniumCode);
	});

	if (darwiniumCodes.length != ogCodeLength)
		await container.prisma.boosterCodes.delete({
			where: {
				id: darwiniumCode.id
			}
		});

	return container.prisma.boosterReward.update({
		where: { userId: boosterReward.userId },
		data: { rewardingDate: new Date(Date.now() + 1000 * 3600 * 24 * 28) }
	});
};

export const boosterChannelId = '800981350714834964';
export const boosterRoleId = '660930089990488099';

// BoosterRewards - create automatic booster rewards for author of message
export const createBoosterRewards = async (client: Client, userId: string): Promise<APIInteractionResponseCallbackData> => {
	const boosterReward = await container.prisma.boosterReward.findUnique({ where: { userId } });
	if (boosterReward) return { content: 'You already have a booster reward!', flags: MessageFlags.Ephemeral };

	const newBoosterReward = await container.prisma.boosterReward.create({
		data: {
			userId,
			rewardingDate: new Date(Date.now() + 1000 * 3600 * 24 * 28)
		}
	});

	if (!newBoosterReward)
		return {
			content: `the automated rewarder failed at creating the scheduled reward, try again. If it continues to fail, DM <@${UserId.sirh}>.`,
			flags: MessageFlags.Ephemeral
		};

	scheduleJob(newBoosterReward.rewardingDate, () => handleBoosterReward(client, newBoosterReward));

	return {
		content: `You will receive your booster reward on ${formattedDate(newBoosterReward.rewardingDate.valueOf())}`,
		flags: MessageFlags.Ephemeral
	};
};

// Reminder - handle finished reminder
export const handleReminder = async (client: Client, reminderData: Reminder, reminder: UserReminder) => {
	client.rest.post(Routes.channelMessages(reminder.channelId), {
		body: {
			content: `<@${reminderData.userId}> Reminder: ${reminder.message}`,
			allowed_mentions: { users: [reminderData.userId] }
		}
	});
	if (reminderData.reminders.length == 1) return container.prisma.reminder.delete({ where: { userId: reminderData.userId } });

	return container.prisma.reminder.update({
		where: { userId: reminderData.userId },
		data: { reminders: reminderData.reminders.filter((r) => r.reminderId != reminder.reminderId) as object[] }
	});
};

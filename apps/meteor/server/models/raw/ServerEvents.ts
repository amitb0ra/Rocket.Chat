import type { IServerEvent, RocketChatRecordDeleted } from '@rocket.chat/core-typings';
import { ServerEventType } from '@rocket.chat/core-typings';
import type { IServerEventsModel } from '@rocket.chat/model-typings';
import type { Collection, Db, IndexDescription } from 'mongodb';

import { BaseRaw } from './BaseRaw';

export class ServerEventsRaw extends BaseRaw<IServerEvent> implements IServerEventsModel {
	constructor(db: Db, trash?: Collection<RocketChatRecordDeleted<IServerEvent>>) {
		super(db, 'server_events', trash);
	}

	protected modelIndexes(): IndexDescription[] {
		return [{ key: { t: 1, ip: 1, ts: -1 } }, { key: { 't': 1, 'u.username': 1, 'ts': -1 } }];
	}

	async findLastFailedAttemptByIp(ip: string): Promise<IServerEvent | null> {
		return this.findOne<IServerEvent>(
			{
				ip,
				t: ServerEventType.FAILED_LOGIN_ATTEMPT,
			},
			{ sort: { ts: -1 } },
		);
	}

	async findLastFailedAttemptByUsername(username: string): Promise<IServerEvent | null> {
		return this.findOne<IServerEvent>(
			{
				'u.username': username,
				't': ServerEventType.FAILED_LOGIN_ATTEMPT,
			},
			{ sort: { ts: -1 } },
		);
	}

	async findLastSuccessfulAttemptByIp(ip: string): Promise<IServerEvent | null> {
		return this.findOne<IServerEvent>(
			{
				ip,
				t: ServerEventType.LOGIN,
			},
			{ sort: { ts: -1 } },
		);
	}

	async findLastSuccessfulAttemptByUsername(username: string): Promise<IServerEvent | null> {
		return this.findOne<IServerEvent>(
			{
				'u.username': username,
				't': ServerEventType.LOGIN,
			},
			{ sort: { ts: -1 } },
		);
	}

	async countFailedAttemptsByUsernameSince(username: string, since: Date): Promise<number> {
		return this.countDocuments({
			'u.username': username,
			't': ServerEventType.FAILED_LOGIN_ATTEMPT,
			'ts': {
				$gte: since,
			},
		});
	}

	countFailedAttemptsByIpSince(ip: string, since: Date): Promise<number> {
		return this.countDocuments({
			ip,
			t: ServerEventType.FAILED_LOGIN_ATTEMPT,
			ts: {
				$gte: since,
			},
		});
	}

	countFailedAttemptsByIp(ip: string): Promise<number> {
		return this.countDocuments({
			ip,
			t: ServerEventType.FAILED_LOGIN_ATTEMPT,
		});
	}

	countFailedAttemptsByUsername(username: string): Promise<number> {
		return this.countDocuments({
			'u.username': username,
			't': ServerEventType.FAILED_LOGIN_ATTEMPT,
		});
	}
}

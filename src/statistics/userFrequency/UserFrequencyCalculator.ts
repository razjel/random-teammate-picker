/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-30
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {UserId} from "../../user/UserId";
import {RandomizeHistoryEntry} from "../../randomize/RandomizeHistoryEntry";
import {UserFrequencyStatistics} from "./UserFrequencyStatistics";

export class UserFrequencyCalculator {
	public calculate(entries: RandomizeHistoryEntry[]): UserFrequencyStatistics {
		const userFrequency: UserFrequencyStatistics = new Map<UserId, number>();
		for (const entry of entries) {
			const userCount = entry.order.length;
			for (let i = 0; i < userCount; i++) {
				const userId = entry.order.get(i);
				if (!userFrequency.has(userId)) {
					userFrequency.set(userId, 0);
				}
				const frequencyValue = userCount - i;
				userFrequency.set(userId, userFrequency.get(userId) + frequencyValue);
			}
		}
		return userFrequency;
	}
}
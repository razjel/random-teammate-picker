import {RandomizeHistoryEntry} from "../../../randomize/RandomizeHistoryEntry";
import {RandomizeHistoryEntryDTO} from "./dto/RandomizeHistoryEntryDTO";

/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-12-01
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
export class RandomizeOrderEntryParser {
	public static parse(userOrders: RandomizeHistoryEntryDTO, date: Date): RandomizeHistoryEntry[] {
		const historyEntries: RandomizeHistoryEntry[] = [];
		for (const key in userOrders) {
			const order = userOrders[key];
			historyEntries.push(new RandomizeHistoryEntry(date, order.split(";")));
		}
		return historyEntries;
	}
}

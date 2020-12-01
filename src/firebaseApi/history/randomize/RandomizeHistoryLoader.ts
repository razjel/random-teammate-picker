import {RandomizeHistoryEntry} from "../../../randomize/RandomizeHistoryEntry";
import {DatabasePath} from "../../DatabasePath";
import {DatabaseWrapper} from "../../DatabaseWrapper";
import {PastDaysPathsGenerator} from "../PastDaysPathsGenerator";
import {PathAndDate} from "../PathAndDate";
import {RandomizeHistoryEntryDTO} from "./dto/RandomizeHistoryEntryDTO";
import {RandomizeHistoryYearDTO} from "./dto/RandomizeHistoryYearDTO";
import {RandomizeOrderEntryParser} from "./RandomizeOrderEntryParser";

/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-12-01
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
export class RandomizeHistoryLoader {
	private db: DatabaseWrapper;

	constructor(db: DatabaseWrapper) {
		this.db = db;
	}

	public async loadAllHistory(): Promise<RandomizeHistoryEntry[]> {
		const historyDTO: RandomizeHistoryYearDTO = await this.db.query(DatabasePath.randomizeHistory);
		let historyEntries: RandomizeHistoryEntry[] = [];
		for (const year in historyDTO) {
			const monthDTO = historyDTO[year];
			for (const month in monthDTO) {
				const dayDTO = monthDTO[month];
				for (const day in dayDTO) {
					const date = new Date(`${year}-${month}-${day}T12:00:00.000Z`);
					historyEntries = historyEntries.concat(RandomizeOrderEntryParser.parse(dayDTO[day], date));
				}
			}
		}
		return historyEntries;
	}

	public async loadHistoryFromLastDays(daysAmount): Promise<RandomizeHistoryEntry[]> {
		const pathAndDates: PathAndDate[] = PastDaysPathsGenerator.generate(daysAmount);
		const promises = [];
		let historyEntries: RandomizeHistoryEntry[] = [];
		for (const {path, date} of pathAndDates) {
			promises.push(
				this.db
					.query([DatabasePath.randomizeHistory, path].join("/"))
					.then((userOrders: RandomizeHistoryEntryDTO) => {
						historyEntries = historyEntries.concat(RandomizeOrderEntryParser.parse(userOrders, date));
					})
			);
		}
		await Promise.all(promises);
		return historyEntries;
	}
}

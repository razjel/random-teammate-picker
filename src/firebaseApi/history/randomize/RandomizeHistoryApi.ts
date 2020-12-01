import {RandomizeHistoryEntry} from "../../../randomize/RandomizeHistoryEntry";
import {Randomize} from "../../../randomize/Randomize";
import {UserId} from "../../../user/UserId";
import {DatabasePath} from "../../DatabasePath";
import {DatabaseWrapper} from "../../DatabaseWrapper";
import {RandomizeHistoryYearDTO} from "./RandomizeHistoryYearDTO";

/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-29
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
export class RandomizeHistoryApi {
	private db: DatabaseWrapper;

	constructor(db: DatabaseWrapper) {
		this.db = db;
	}

	public async list(): Promise<Randomize> {
		const historyDTO: RandomizeHistoryYearDTO = await this.db.query(DatabasePath.randomizeHistory);
		const history = new Randomize();
		for (const year in historyDTO) {
			const monthDTO = historyDTO[year];
			for (const month in monthDTO) {
				const dayDTO = monthDTO[month];
				for (const day in dayDTO) {
					const entriesMap = dayDTO[day];
					for (const key in entriesMap) {
						const order = entriesMap[key];
						history.history.push(
							new RandomizeHistoryEntry(new Date(`${year}-${month}-${day}T12:00:00.000Z`), order.split(";"))
						);
					}
				}
			}
		}
		return history;
	}

	public async addRandomizeResult(userOrder: UserId[]): Promise<void> {
		const currentDate = new Date();
		return this.db.pushToArray(
			[
				DatabasePath.randomizeHistory,
				currentDate.getFullYear(),
				currentDate.getMonth() + 1,
				currentDate.getDate(),
			].join("/"),
			userOrder.join(";")
		);
	}
}
import {RandomizeEntry} from "../../randomize/RandomizeEntry";
import {RandomizeHistory} from "../../randomize/RandomizeHistory";
import {DatabasePath} from "../DatabasePath";
import {DatabaseWrapper} from "../DatabaseWrapper";
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

	public async list(): Promise<RandomizeHistory> {
		const historyDTO: RandomizeHistoryYearDTO = await this.db.query(DatabasePath.randomizeHistory);
		const history = new RandomizeHistory();
		for (const year in historyDTO) {
			const monthDTO = historyDTO[year];
			for (const month in monthDTO) {
				const dayDTO = monthDTO[month];
				for (const day in dayDTO) {
					for (const userOrder of dayDTO[day]) {
						history.entries.push(
							new RandomizeEntry(new Date(`${year}-${month}-${day}T12:00:00.000Z`), userOrder.split(";"))
						);
					}
				}
			}
		}
		return history;
	}
}

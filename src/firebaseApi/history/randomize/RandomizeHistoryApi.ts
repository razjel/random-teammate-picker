import {BindArray} from "../../../common/actionFlow/binding/BindArray";
import {RandomizeHistoryEntry} from "../../../randomize/RandomizeHistoryEntry";
import {Randomize} from "../../../randomize/Randomize";
import {UserId} from "../../../user/UserId";
import {DatabasePath} from "../../DatabasePath";
import {DatabaseWrapper} from "../../DatabaseWrapper";
import {HistoryPathGenerator} from "../HistoryPathGenerator";
import {PastDaysPathGenerator} from "./PastDaysPathGenerator";
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

	public async list(): Promise<RandomizeHistoryEntry[]> {
		const historyDTO: RandomizeHistoryYearDTO = await this.db.query(DatabasePath.randomizeHistory);
		const historyEntries: RandomizeHistoryEntry[] = [];
		for (const year in historyDTO) {
			const monthDTO = historyDTO[year];
			for (const month in monthDTO) {
				const dayDTO = monthDTO[month];
				for (const day in dayDTO) {
					const entriesMap = dayDTO[day];
					for (const key in entriesMap) {
						const order = entriesMap[key];
						historyEntries.push(
							new RandomizeHistoryEntry(
								new Date(`${year}-${month}-${day}T12:00:00.000Z`),
								order.split(";")
							)
						);
					}
				}
			}
		}
		return historyEntries;
	}

	public async listLast7Days() {
		const paths = PastDaysPathGenerator.generate(7);
		const promises = [];
		for (const path of paths) {
			promises.push(
				this.db.query([DatabasePath.randomizeHistory, path].join("/")).then((result) => {
					console.log("result:", result);
				})
			);
		}
		await Promise.all(promises);
	}

	public async listLast30Days() {}

	public async addRandomizeResult(userOrder: UserId[]): Promise<void> {
		const currentDate = new Date();
		return this.db.pushToArray(
			[DatabasePath.randomizeHistory, HistoryPathGenerator.generateFromDate(currentDate)].join("/"),
			userOrder.join(";")
		);
	}
}

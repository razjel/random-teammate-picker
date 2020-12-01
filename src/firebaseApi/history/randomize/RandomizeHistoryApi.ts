/*
 * a
 */

/*
 * a
 */

import {BindArray} from "../../../common/actionFlow/binding/BindArray";
import {RandomizeHistoryEntry} from "../../../randomize/RandomizeHistoryEntry";
import {Randomize} from "../../../randomize/Randomize";
import {UserId} from "../../../user/UserId";
import {DatabasePath} from "../../DatabasePath";
import {DatabaseWrapper} from "../../DatabaseWrapper";
import {HistoryPathGenerator} from "../HistoryPathGenerator";
import {PastDaysPathsGenerator} from "../PastDaysPathsGenerator";
import {PathAndDate} from "../PathAndDate";
import {RandomizeHistoryEntryDTO} from "./dto/RandomizeHistoryEntryDTO";
import {RandomizeHistoryYearDTO} from "./dto/RandomizeHistoryYearDTO";
import {RandomizeHistoryLoader} from "./RandomizeHistoryLoader";
import {RandomizeOrderEntryParser} from "./RandomizeOrderEntryParser";

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

	public async listAllHistory(): Promise<RandomizeHistoryEntry[]> {
		return new RandomizeHistoryLoader(this.db).loadAllHistory();
	}

	public async listLast7Days(): Promise<RandomizeHistoryEntry[]> {
		return new RandomizeHistoryLoader(this.db).loadHistoryFromLastDays(7);
	}

	public async listLast30Days(): Promise<RandomizeHistoryEntry[]> {
		return new RandomizeHistoryLoader(this.db).loadHistoryFromLastDays(30);
	}

	public async addRandomizeResult(userOrder: UserId[]): Promise<void> {
		const currentDate = new Date();
		return this.db.pushToArray(
			[DatabasePath.randomizeHistory, HistoryPathGenerator.generateFromDate(currentDate)].join("/"),
			userOrder.join(";")
		);
	}
}

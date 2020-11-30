/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-30
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */

import {afAction, afAsyncAction} from "../common/actionFlow/action/decorators/AFActionDecorators";
import {Md} from "../globalModel/Md";
import {RandomizeStatisticsCalculator} from "./RandomizeStatisticsCalculator";

export class RandomizeActions {
	@afAsyncAction("RandomizeActions.listAll")
	public static async listAll() {
		const history = await Md.randomizeHistoryApi.list();
		Md.randomize.entries.clear();
		Md.randomize.entries.pushArray(history.entries);
	}

	@afAction("RandomizeActions.calculateUserFrequencyForAllHistory")
	public static calculateUserFrequencyForAllHistory() {
		const userFrequencyStatistics = new RandomizeStatisticsCalculator().calculate(Md.randomize.entries.toArray());
		Md.randomize.userFrequency = userFrequencyStatistics;
	}
}

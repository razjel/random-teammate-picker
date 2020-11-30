import {afAction} from "../common/actionFlow/action/decorators/AFActionDecorators";
import {Md} from "../globalModel/Md";
import {UserFrequencyCalculator} from "./userFrequency/UserFrequencyCalculator";

/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-12-01
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
export class StatisticsActions {
	@afAction("StatisticsActions.calculateUserFrequencyForAllHistory")
	public static calculateUserFrequencyForAllHistory() {
		const userFrequencyStatistics = new UserFrequencyCalculator().calculate(Md.randomize.entries.toArray());
		Md.statistics.userFrequency = userFrequencyStatistics;
	}
}

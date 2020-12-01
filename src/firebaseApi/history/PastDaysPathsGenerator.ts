/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-12-01
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {HistoryPathGenerator} from "./HistoryPathGenerator";

export class PastDaysPathsGenerator {
	public static generate(days: number): string[] {
		const paths = [];
		const currentDate = new Date();
		for (let i = 0; i < days; i++) {
			paths.push(HistoryPathGenerator.generateFromDate(currentDate));
			currentDate.setDate(currentDate.getDate() - 1);
		}
		return paths;
	}
}

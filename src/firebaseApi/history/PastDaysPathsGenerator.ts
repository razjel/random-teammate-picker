/*
 * a
 */

/*
 * a
 */
import {HistoryPathGenerator} from "./HistoryPathGenerator";
import {PathAndDate} from "./PathAndDate";

export class PastDaysPathsGenerator {
	public static generate(daysAmount: number): PathAndDate[] {
		const pathAndDates: PathAndDate[] = [];
		const currentDate = new Date();
		for (let i = 0; i < daysAmount; i++) {
			pathAndDates.push(
				new PathAndDate(new Date(currentDate), HistoryPathGenerator.generateFromDate(currentDate))
			);
			currentDate.setDate(currentDate.getDate() - 1);
		}
		return pathAndDates;
	}
}

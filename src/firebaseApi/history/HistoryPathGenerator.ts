/*
 * a
 */

/*
 * a
 */
export class HistoryPathGenerator {
	public static generateFromDate(date: Date): string {
		return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("/");
	}
}

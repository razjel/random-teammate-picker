/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-12-01
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
export class HistoryPathGenerator {
	public static generateFromDate(date: Date): string {
		return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("/");
	}
}

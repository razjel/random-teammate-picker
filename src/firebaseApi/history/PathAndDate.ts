/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-12-01
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
export class PathAndDate {
	public date: Date;
	public path: string;

	constructor(date: Date, path: string) {
		this.date = date;
		this.path = path;
	}
}

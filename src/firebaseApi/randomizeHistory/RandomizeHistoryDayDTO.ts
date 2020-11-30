/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-29
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */

export class RandomizeHistoryDayDTO {
	/**
	 * f.e. ["user1;user2","user2;user1"]
	 */
	[day: string]: string[];
}

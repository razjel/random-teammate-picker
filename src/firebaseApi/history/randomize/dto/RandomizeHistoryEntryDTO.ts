/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-29
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */

/**
 * f.e. {uniqueId: "user1;user2", otherUniqueId: "user2;user1"}
 */
export interface RandomizeHistoryEntryDTO {
	[id: string]: string;
}

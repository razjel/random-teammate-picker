/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-29
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {RandomizeHistoryEntryDTO} from "./RandomizeHistoryEntryDTO";

export class RandomizeHistoryDayDTO {
	[day: string]: RandomizeHistoryEntryDTO;
}

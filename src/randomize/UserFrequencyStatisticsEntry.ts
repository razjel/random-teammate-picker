/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-30
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {AFDataObject} from "../common/actionFlow/binding/AFDataObject";

export class UserFrequencyStatisticsEntry extends AFDataObject {
	public userId: string;
	public frequency: number;

	constructor(userId: string, frequency: number) {
		super();
		this.userId = userId;
		this.frequency = frequency;
		this.__initBind("UserFrequencyStatisticsEntry", UserFrequencyStatisticsEntry);
	}
}

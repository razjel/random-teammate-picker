/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-12-01
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {AFDataObject} from "../common/actionFlow/binding/AFDataObject";
import {UserFrequencyStatistics} from "./userFrequency/UserFrequencyStatistics";

export class Statistics extends AFDataObject {
	public userFrequency: UserFrequencyStatistics = null;

	constructor() {
		super();
		this.__initBind("Statistics", Statistics);
	}
}

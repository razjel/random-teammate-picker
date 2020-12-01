/*
 * a
 */

/*
 * a
 */
import {AFDataObject} from "../common/actionFlow/binding/AFDataObject";
import {UserFrequencyStatistics} from "./userFrequency/UserFrequencyStatistics";

export class Statistics extends AFDataObject {
	public userFrequencyLast7Days: UserFrequencyStatistics = null;
	public userFrequencyLast30Days: UserFrequencyStatistics = null;

	constructor() {
		super();
		this.__initBind("Statistics", Statistics);
	}
}

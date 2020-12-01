/*
 * a
 */

/*
 * a
 */
import {AFDataObject} from "../common/actionFlow/binding/AFDataObject";
import {BindArray} from "../common/actionFlow/binding/BindArray";
import {UserId} from "../user/UserId";

export class RandomizeHistoryEntry extends AFDataObject {
	public date: Date = null;
	public order = new BindArray<UserId>();

	constructor(date?: Date, order?: UserId[]) {
		super();
		this.date = date;
		this.order = new BindArray<UserId>(order);
		this.__initBind("RandomizeEntry", RandomizeHistoryEntry);
	}
}

/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-30
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {AFDataObject} from "../common/actionFlow/binding/AFDataObject";
import {BindArray} from "../common/actionFlow/binding/BindArray";
import {UserId} from "../user/UserId";

export class RandomizeEntry extends AFDataObject {
	public date: Date = null;
	public order = new BindArray<UserId>();

	constructor(date?: Date, order?: UserId[]) {
		super();
		this.date = date;
		this.order = new BindArray<UserId>(order);
		this.__initBind("RandomizeEntry", RandomizeEntry);
	}
}

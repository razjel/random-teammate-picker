/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-30
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {AFDataObject} from "../common/actionFlow/binding/AFDataObject";
import {BindArray} from "../common/actionFlow/binding/BindArray";

export class RandomizeEntry extends AFDataObject {
	public date: Date = null;
	public order = new BindArray<string>();

	constructor(date?: Date, order?: string[]) {
		super();
		this.date = date;
		this.order = new BindArray<string>(order);
		this.__initBind("RandomizeEntry", RandomizeEntry);
	}
}

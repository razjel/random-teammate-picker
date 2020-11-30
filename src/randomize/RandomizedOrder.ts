/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-12-01
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {AFDataObject} from "../common/actionFlow/binding/AFDataObject";
import {BindArray} from "../common/actionFlow/binding/BindArray";
import {User} from "../user/User";

export class RandomizedOrder extends AFDataObject {
	private static counter = 0;

	public id = "";
	public order = new BindArray<User>();

	constructor() {
		super();
		this.regenerateId();
		this.__initBind("RandomizedOrder", RandomizedOrder);
	}

	public regenerateId() {
		RandomizedOrder.counter++;
		this.id = RandomizedOrder.counter.toString();
	}
}

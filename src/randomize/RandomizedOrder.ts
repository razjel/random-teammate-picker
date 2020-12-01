/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-12-01
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {AFDataObject} from "../common/actionFlow/binding/AFDataObject";
import {BindArray} from "../common/actionFlow/binding/BindArray";
import {BindUtil} from "../common/actionFlow/binding/BindUtil";
import {User} from "../user/User";

export class RandomizedOrder extends AFDataObject {
	private static counter = 0;

	public id = "";
	public order = new BindArray<User>();
	@BindUtil.nonBindable
	public wasSavedOnServer = false;

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

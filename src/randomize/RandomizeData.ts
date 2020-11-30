import {AFDataObject} from "../common/actionFlow/binding/AFDataObject";
import {BindArray} from "../common/actionFlow/binding/BindArray";
import {User} from "../user/User";
import {RandomizeEntry} from "./RandomizeEntry";

/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-30
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
export class RandomizeData extends AFDataObject {
	public history = new BindArray<RandomizeEntry>();
	public randomSorted = new BindArray<User>();

	constructor() {
		super();
		this.__initBind("RandomizeHistory", RandomizeData);
	}
}

import {AFDataObject} from "../common/actionFlow/binding/AFDataObject";
import {BindArray} from "../common/actionFlow/binding/BindArray";
import {RandomizeEntry} from "./RandomizeEntry";

/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-30
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
export class RandomizeHistory extends AFDataObject {
	public entries = new BindArray<RandomizeEntry>();

	constructor() {
		super();
		this.__initBind("RandomizeHistory", RandomizeHistory);
	}
}

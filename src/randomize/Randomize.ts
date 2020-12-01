import {AFDataObject} from "../common/actionFlow/binding/AFDataObject";
import {BindArray} from "../common/actionFlow/binding/BindArray";
import {RandomizedOrder} from "./RandomizedOrder";
import {RandomizeHistoryEntry} from "./RandomizeHistoryEntry";

/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-30
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
export class Randomize extends AFDataObject {
	public historyForLast7Days = new BindArray<RandomizeHistoryEntry>();
	public historyForLast30Days = new BindArray<RandomizeHistoryEntry>();
	public randomizedOrder = new RandomizedOrder();

	constructor() {
		super();
		this.__initBind("RandomizeHistory", Randomize);
	}
}

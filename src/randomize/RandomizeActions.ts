/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-30
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */

import {afAction, afAsyncAction} from "../common/actionFlow/action/decorators/AFActionDecorators";
import {Md} from "../globalModel/Md";
import {RandomizedOrder} from "./RandomizedOrder";
import {UserRandomizer} from "./UserRandomizer";

export class RandomizeActions {
	@afAsyncAction("RandomizeActions.listAll")
	public static async listAllHistoryFromServer() {
		const history = await Md.randomizeHistoryApi.list();
		Md.randomize.history.clear();
		Md.randomize.history.pushArray(history.history);
	}

	@afAction("RandomizeActions.randomize")
	public static randomize() {
		const randomizedUsers = UserRandomizer.randomize(Md.users.all.toArray());
		Md.randomize.randomizedOrder.regenerateId();
		Md.randomize.randomizedOrder.order.clear();
		Md.randomize.randomizedOrder.order.pushArray(randomizedUsers);
	}

	@afAsyncAction("UserActions.addRandomizeResultToServer")
	public static async addRandomizeResultToServer() {
		await Md.randomizeHistoryApi.addRandomizeResult(Md.randomize.randomizedOrder.map((user) => user.id));
	}
}

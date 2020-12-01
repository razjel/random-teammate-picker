/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-30
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */

import {afAction, afAsyncAction} from "../common/actionFlow/action/decorators/AFActionDecorators";
import {Md} from "../globalModel/Md";
import {StatisticsActions} from "../statistics/StatisticsActions";
import {UserRandomizer} from "./UserRandomizer";

export class RandomizeActions {
	@afAsyncAction("RandomizeActions.listAll")
	public static async listAllHistoryFromServer() {
		const entries = await Md.randomizeHistoryApi.listLast7Days();
		Md.randomize.history.clear();
		Md.randomize.history.pushArray(entries);
	}

	@afAction("RandomizeActions.randomize")
	public static randomize() {
		const randomizedUsers = UserRandomizer.randomize(Md.users.all.toArray());
		Md.randomize.randomizedOrder.regenerateId();
		Md.randomize.randomizedOrder.wasSavedOnServer = false;
		Md.randomize.randomizedOrder.order.clear();
		Md.randomize.randomizedOrder.order.pushArray(randomizedUsers);
	}

	@afAsyncAction("UserActions.addRandomizeResultToServer")
	public static async addRandomizeResultToServer() {
		if (!Md.randomize.randomizedOrder.wasSavedOnServer) {
			try {
				Md.randomize.randomizedOrder.wasSavedOnServer = true;
				const order = Md.randomize.randomizedOrder.order.map((user) => user.id);
				await Md.randomizeHistoryApi.addRandomizeResult(order);
				await RandomizeActions.listAllHistoryFromServer();
				StatisticsActions.calculateUserFrequencyForAllHistory();
			} catch (error) {
				Md.randomize.randomizedOrder.wasSavedOnServer = false;
				alert("failed to add randomize result to server");
			}
		} else {
			alert("this randomize result was already saved on server");
		}
	}
}

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
	@afAsyncAction("RandomizeActions.listHistoryLast7Days")
	public static async listHistoryLast7Days() {
		const entries = await Md.randomizeHistoryApi.listLast7Days();
		Md.randomize.historyForLast7Days.clear();
		Md.randomize.historyForLast7Days.pushArray(entries);
	}

	@afAsyncAction("RandomizeActions.listHistoryLast30Days")
	public static async listHistoryLast30Days() {
		const entries = await Md.randomizeHistoryApi.listLast30Days();
		Md.randomize.historyForLast30Days.clear();
		Md.randomize.historyForLast30Days.pushArray(entries);
	}

	@afAsyncAction("RandomizeActions.refreshRandomizeHistory")
	public static async refreshRandomizeHistory() {
		await Promise.all([RandomizeActions.listHistoryLast7Days(), RandomizeActions.listHistoryLast30Days()]);
	}

	@afAction("RandomizeActions.randomize")
	public static randomize() {
		const randomizedUsers = UserRandomizer.randomize(Md.users.all.toArray());
		Md.randomize.randomizedOrder.regenerateId();
		Md.randomize.randomizedOrder.wasSavedOnServer = false;
		Md.randomize.randomizedOrder.order.clear();
		Md.randomize.randomizedOrder.order.pushArray(randomizedUsers);
	}

	@afAsyncAction("UserActions.saveRandomizeResultToServer")
	public static async saveRandomizeResultToServer() {
		if (Md.randomize.randomizedOrder.wasSavedOnServer) {
			alert("this randomize result was already saved on server");
		} else if (!Md.randomize.randomizedOrder.order.length) {
			alert("there is nothing to save");
		} else {
			try {
				Md.randomize.randomizedOrder.wasSavedOnServer = true;
				const order = Md.randomize.randomizedOrder.order.map((user) => user.id);
				await Md.randomizeHistoryApi.addRandomizeResult(order);
				await RandomizeActions.refreshRandomizeHistory();
				StatisticsActions.calculateUserFrequency();
			} catch (error) {
				Md.randomize.randomizedOrder.wasSavedOnServer = false;
				alert("failed to add randomize result to server");
			}
		}
	}
}

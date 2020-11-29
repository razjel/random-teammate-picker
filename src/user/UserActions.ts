/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-29
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {afAction, afAsyncAction} from "../common/actionFlow/action/decorators/AFActionDecorators";
import {Md} from "../globalModel/Md";
import {InitUsers} from "./InitUsers";
import {User} from "./User";
import {UserRandomizer} from "./UserRandomizer";

export class UserActions {
	@afAction("UserActions.randomize")
	public static randomize() {
		const randomizedUsers = UserRandomizer.randomize(Md.users.all.toArray());
		Md.users.randomSorted.clear();
		Md.users.randomSorted.pushArray(randomizedUsers);
	}

	@afAsyncAction("UserActions.listUsers")
	public static async listUsers() {
		const allUsers = InitUsers.init(await Md.userApi.list());
		Md.users.all.clear();
		Md.users.all.pushArray(allUsers);
	}

	@afAsyncAction("UserActions.addUser")
	public static async addUser(user: User) {
		Md.users.all.push(user);
		const success = await Md.userApi.add(user.id, user.name);
		if (!success) {
			Md.users.all.removeByKey(user.id);
			alert(`failed to add user: ${user.id}-${user.name}`);
		}
	}
}

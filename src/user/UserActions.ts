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
	public static async addUser(userName: string) {
		const user = new User();
		user.name = userName;
		try {
			const userId = await Md.userApi.add(user.name);
			user.id = userId;
			Md.users.all.push(user);
		} catch (error) {
			alert(`failed to add user: ${user.id}-${user.name}`);
		}
	}

	@afAsyncAction("UserActions.removeUser")
	public static async removeUser(userId: string) {
		const user = Md.users.all.getByKey(userId);
		try {
			Md.users.all.removeByKey(userId);
			await Md.userApi.remove(userId);
		} catch (error) {
			Md.users.all.push(user);
			alert(`failed to remove user: ${user.id}-${user.name}`);
		}
	}
}

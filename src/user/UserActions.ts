/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-29
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {afAction, afAsyncAction} from "../common/actionFlow/action/decorators/AFActionDecorators";
import {Md} from "../globalModel/Md";
import {User} from "./User";
import {UserId} from "./UserId";
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
		const allUsers = await Md.userApi.list();
		Md.users.all.clear();
		Md.users.all.pushArray(allUsers);
	}

	@afAsyncAction("UserActions.addUser")
	public static async addUser(userId: UserId, userName: string) {
		const user = new User(userId, userName);
		try {
			Md.users.all.push(user);
			await Md.userApi.add(user.id, user.name);
		} catch (error) {
			Md.users.all.removeByKey(user.id);
			alert(`failed to add user: ${user.id}-${user.name}`);
		}
	}

	@afAsyncAction("UserActions.removeUser")
	public static async removeUser(userId: UserId) {
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

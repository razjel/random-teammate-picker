/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-29
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {DatabasePath} from "../firebaseApi/DatabasePath";
import {Md} from "../globalModel/Md";
import {User} from "./User";

export class InitUsers {
	public static async init() {
		const users: {userId: string; userName: string} = await Md.db.query(DatabasePath.users);
		for (const userId in users) {
			Md.users.all.push(new User(userId, users[userId]));
		}
	}
}

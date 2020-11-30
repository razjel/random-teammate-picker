/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-29
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {User} from "../user/User";

export class UserRandomizer {
	public static randomize(users: User[]) {
		const randomUsers = [];
		users = users.concat();
		while (users.length) {
			const spliceResult = users.splice(Math.floor(Math.random() * users.length), 1);
			randomUsers.push(spliceResult[0]);
		}
		return randomUsers;
	}
}

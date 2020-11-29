/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-29
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {UsersDTO} from "../firebaseApi/user/UsersDTO";
import {User} from "./User";

export class InitUsers {
	public static init(usersDTO: UsersDTO) {
		const users: User[] = [];
		for (const userId in usersDTO) {
			users.push(new User(userId, usersDTO[userId]));
		}
		return users;
	}
}

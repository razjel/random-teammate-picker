/*
 * a
 */

/*
 * a
 */

import {User} from "../../user/User";
import {UserId} from "../../user/UserId";
import {DatabasePath} from "../DatabasePath";
import {DatabaseWrapper} from "../DatabaseWrapper";
import {UsersDTO} from "./UsersDTO";

/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-29
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
export class UserApi {
	private db: DatabaseWrapper;

	constructor(db: DatabaseWrapper) {
		this.db = db;
	}

	public async list(): Promise<User[]> {
		const usersDTO = await this.db.query(DatabasePath.users);
		const users: User[] = [];
		for (const userId in usersDTO) {
			users.push(new User(userId, usersDTO[userId]));
		}
		return users;
	}

	public add(userId: UserId, userName: string): Promise<void> {
		return this.db.add([DatabasePath.users, userId].join("/"), userName);
	}

	public remove(userId: UserId): Promise<string> {
		return this.db.remove([DatabasePath.users, userId].join("/"));
	}
}

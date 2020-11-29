import {Md} from "../../globalModel/Md";
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

	public list(): Promise<UsersDTO> {
		return this.db.query(DatabasePath.users);
	}

	public add(userName: string): Promise<string> {
		return this.db.listAdd(DatabasePath.users, userName);
	}

	public remove(userId: string): Promise<string> {
		return this.db.listRemove(DatabasePath.users, userId);
	}
}

/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-12-19
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {Md} from "../globalModel/Md";
import {UserId} from "./UserId";

export class UserQuery {
	public static getUserName(userId: UserId): string {
		const user = Md.users.all.getByKey(userId);
		if (!user) {
			throw new Error("there is no user: " + userId);
		}
		return user.name;
	}
}

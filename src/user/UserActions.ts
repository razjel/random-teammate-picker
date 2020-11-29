/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-29
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {afAction} from "../common/actionFlow/action/decorators/AFActionDecorators";
import {Md} from "../globalModel/Md";
import {UserRandomizer} from "./UserRandomizer";

export class UserActions {
	@afAction(`UserActions.randomize`)
	public static randomize() {
		const randomizedUsers = UserRandomizer.randomize(Md.users.all.toArray());
		Md.users.randomSorted.clear();
		Md.users.randomSorted.pushArray(randomizedUsers);
	}
}

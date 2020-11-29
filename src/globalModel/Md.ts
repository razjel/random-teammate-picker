/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-21
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {DatabaseWrapper} from "../firebaseApi/DatabaseWrapper";
import {RandomizeHistoryApi} from "../firebaseApi/randomizeHistory/RandomizeHistoryApi";
import {UserApi} from "../firebaseApi/user/UserApi";
import {Users} from "../user/Users";

export class Md {
	public static userApi: UserApi;
	public static randomizeHistoryApi: RandomizeHistoryApi;
	public static users = new Users();
}

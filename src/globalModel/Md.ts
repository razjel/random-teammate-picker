/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-21
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {DatabaseWrapper} from "../firebaseApi/DatabaseWrapper";
import {RandomizeHistoryApi} from "../firebaseApi/history/randomize/RandomizeHistoryApi";
import {UserApi} from "../firebaseApi/user/UserApi";
import {RandomizeHistory} from "../randomize/RandomizeHistory";
import {Statistics} from "../statistics/Statistics";
import {Users} from "../user/Users";

export class Md {
	public static userApi: UserApi;
	public static randomizeHistoryApi: RandomizeHistoryApi;
	public static users = new Users();
	public static randomize = new RandomizeHistory();
	public static statistics = new Statistics();
}

/*
 * a
 */

/*
 * a
 */
import {DatabaseWrapper} from "../firebaseApi/DatabaseWrapper";
import {RandomizeHistoryApi} from "../firebaseApi/history/randomize/RandomizeHistoryApi";
import {UserApi} from "../firebaseApi/user/UserApi";
import {Randomize} from "../randomize/Randomize";
import {Statistics} from "../statistics/Statistics";
import {Users} from "../user/Users";

export class Md {
	public static userApi: UserApi;
	public static randomizeHistoryApi: RandomizeHistoryApi;
	public static users = new Users();
	public static randomize = new Randomize();
	public static statistics = new Statistics();
}

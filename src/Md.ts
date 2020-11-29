/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-21
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {DatabaseWrapper} from "./DatabaseWrapper";
import {Users} from "./Users";

export class Md {
	public static db: DatabaseWrapper;
	public static users = new Users();
}

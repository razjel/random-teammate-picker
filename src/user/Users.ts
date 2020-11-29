/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-22
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {AFDataObject} from "../common/actionFlow/binding/AFDataObject";
import {BindArray} from "../common/actionFlow/binding/BindArray";
import {User} from "./User";

export class Users extends AFDataObject {
	public all = new BindArray<User>();

	constructor() {
		super();
		this.__initBind("Users", Users);
	}
}

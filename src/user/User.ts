/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-22
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import {AFDataObject} from "../common/actionFlow/binding/AFDataObject";
import {UserId} from "./UserId";

export class User extends AFDataObject {
	public id: UserId;
	public name: string;

	constructor(id?: UserId, name?: string) {
		super();
		this.id = id;
		this.name = name;
		this.__initBind("User", User);
	}
}

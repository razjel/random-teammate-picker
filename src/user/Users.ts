/*
 * a
 */

/*
 * a
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

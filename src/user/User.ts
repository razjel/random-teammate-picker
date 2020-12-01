/*
 * a
 */

/*
 * a
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

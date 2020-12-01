/*
 * a
 */

/*
 * a
 */

import {ObjectUtil} from "../../../util/ObjectUtil";

export class AFBaseManager<T = null> {
	protected _id: string = ObjectUtil.generateId("BaseManager");

	protected m: T;

	protected _isDisposed: boolean = false;

	constructor(m: T = null) {
		this.m = m;
	}

	public dispose(): void {
		this._isDisposed = true;
	}
}

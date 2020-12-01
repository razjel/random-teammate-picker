/*
 * a
 */

/*
 * a
 */

import {IConnectedView} from "./IConnectedView";

export class BindExpression {
	protected _func: Function;
	//protected _refreshOnBinds:BindData[]
	public view: IConnectedView;

	constructor(func: Function) {
		//, refreshOnBinds?:BindData[]) {
		this._func = func;
		//this._refreshOnBinds = refreshOnBinds;
	}

	public getValue(): any {
		return this._func();
	}

	public dispose(): void {
		this.view = null;
		this._func = null;
	}

	protected _invalidate = () => {};
}

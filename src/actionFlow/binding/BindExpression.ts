import {IConnectedView} from "./IConnectedView";

/**
 * Created by Michal Czaicki, m.czaicki@getprintbox.com
 * Date: 2015-10-22
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
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

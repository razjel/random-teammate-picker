/*
 * a
 */

/*
 * a
 */

import {BindArray} from "../../binding/BindArray";
import {ActionTreeNode} from "../actionTree/ActionTreeNode";

export class DebugModel {
	public scenario = "";
	public actionTree = new BindArray<ActionTreeNode>();
	public projectConfigList = new BindArray<any>();

	public validateStoredActionsLength = () => {
		while (this.actionTree.length > 40) {
			this.actionTree.shift();
		}
	};

	//---------------------------------------------------------------
	//
	//      Singleton
	//
	//---------------------------------------------------------------
	private static _inst: DebugModel;
	public static get inst(): DebugModel {
		if (!this._inst) this._inst = new DebugModel();
		return this._inst;
	}
}

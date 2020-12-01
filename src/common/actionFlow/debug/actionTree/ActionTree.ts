/*
 * a
 */

/*
 * a
 */

import {ActionTreeNode} from "./ActionTreeNode";
import {FunctionUtil} from "../../../util/FunctionUtil";
import {IActionTree} from "./IActionTree";

export class ActionTree implements IActionTree {
	protected _nestCounter = 0;

	private _rootTree: ActionTreeNode = null;
	private _currentNode: ActionTreeNode = null;

	public beginAction(name: string, args: any[], actionFunction: Function, isProcess: boolean) {
		this._nestCounter++;
		var time: number = 0;
		try {
			time = Date.now();
		} catch (error) {}

		var newNode = new ActionTreeNode(
			name,
			args,
			FunctionUtil.getParametersNames(actionFunction),
			[],
			this._currentNode,
			time,
			isProcess
		);

		if (!this._rootTree) {
			this._rootTree = newNode;
			this._currentNode = this._rootTree;
			return;
		}

		if (this._currentNode) {
			this._currentNode.subActions.push(newNode);
			this._currentNode = newNode;
			return;
		}
	}

	public endAction() {
		if (this._nestCounter === 0) return;

		this._nestCounter--;
		if (!this.isCurrentNodeRoot() && this._currentNode) {
			this._currentNode = this._currentNode.parent;
		}
	}

	public isCurrentNodeRoot(): boolean {
		return this._nestCounter === 0 && !!this._currentNode && !!this._rootTree;
	}

	public getWholeActionTree() {
		return this._rootTree;
	}

	public getCurrentNode(): ActionTreeNode {
		return this._currentNode;
	}

	public cleanTree() {
		this._rootTree = null;
		this._currentNode = null;
	}
}

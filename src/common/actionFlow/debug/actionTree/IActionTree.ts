/*
 * a
 */

/*
 * a
 */

import {ActionTreeNode} from "./ActionTreeNode";

export interface IActionTree {
	beginAction(name: string, args: any[], actionFunction: Function, isProcess: boolean);
	endAction();
	isCurrentNodeRoot();
	getWholeActionTree();
	getCurrentNode(): ActionTreeNode;
	cleanTree();
}

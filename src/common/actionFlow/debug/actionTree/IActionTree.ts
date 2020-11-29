import {ActionTreeNode} from "./ActionTreeNode";

/**
 * Created by Michal Czaicki, m.czaicki@getprintbox.com
 * Date: 2016-03-22
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
export interface IActionTree {
	beginAction(name: string, args: any[], actionFunction: Function, isProcess: boolean);
	endAction();
	isCurrentNodeRoot();
	getWholeActionTree();
	getCurrentNode(): ActionTreeNode;
	cleanTree();
}

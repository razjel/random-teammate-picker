/*
 * a
 */

/*
 * a
 */

import {ActionTreeNode} from "../../debug/actionTree/ActionTreeNode";
import {AFAsyncData} from "../data/AFAsyncData";
import {IAFBaseActionDecoratorOptions} from "./IAFBaseActionDecoratorOptions";

export interface IAFExecuteActionData {
	actionName?: string;
	action?: Function;
	args?: any[];
	thisArg?: any;
	asyncData?: AFAsyncData;
	decoratorOptions?: IAFBaseActionDecoratorOptions;
	actionTreeNode?: ActionTreeNode;
}

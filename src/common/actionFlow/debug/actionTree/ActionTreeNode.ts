/*
 * a
 */

/*
 * a
 */
import {AFDataObject} from "../../binding/AFDataObject";

export class ActionTreeNode extends AFDataObject {
	constructor(
		name: string,
		args: any[],
		argsNames: string[],
		subActions: ActionTreeNode[],
		parent: ActionTreeNode,
		time: number,
		isProcess: boolean
	) {
		super();
		this.name = name;
		this.args = args;
		this.argsNames = argsNames;
		this.subActions = subActions;
		this.parent = parent;
		this.time = time;
		this.isProcess = isProcess;
		this.__initBind("ActionTreeNode", ActionTreeNode);
	}

	public name: string;
	public args: any[];
	public argsNames: string[];
	public subActions: ActionTreeNode[];
	public parent: ActionTreeNode;
	public time: number;
	public isProcess: boolean;
	public whereActionExecutionStop: string = "";

	//if action did not have an effect on the system
	public empty: boolean = false;
}

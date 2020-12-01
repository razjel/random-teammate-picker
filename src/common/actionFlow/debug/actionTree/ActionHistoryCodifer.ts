/*
 * a
 */

/*
 * a
 */

import {ObjectUtil} from "../../../util/ObjectUtil";
import {StringUtil} from "../../../util/StringUtil";
import {ActionTreeNode} from "./ActionTreeNode";

export class ActionHistoryCodifer {
	public static getActionListAsCode(
		actionList: ActionTreeNode[],
		options?: Partial<{
			namesReplacementMap: Map<string, string>;
			actionsNamesToRemove: string[];
			truncateLongMessages: boolean;
			addArrowFunctions: boolean;
		}>
	): string {
		var stringifiedActions = [];

		if (options.namesReplacementMap)
			actionList = this._processBeforeStringify(actionList, options.namesReplacementMap);

		if (options.actionsNamesToRemove)
			actionList = actionList.filter((node) => options.actionsNamesToRemove.indexOf(node.name) === -1);

		actionList.forEach((actionNode) =>
			stringifiedActions.push(ActionHistoryCodifer._encodeAction(actionNode, options))
		);

		return stringifiedActions.join("\n");
	}

	public static getActionListForError(
		actionList: ActionTreeNode[],
		currentNode?: ActionTreeNode,
		options?: Partial<{
			wasViewError: boolean;
			addTime: boolean;
			truncateLongMessages: boolean;
			showSubActions: boolean;
		}>
	): string {
		options = Object.assign({}, options);
		var stringifiedActions = [];

		actionList.forEach((actionNode) =>
			stringifiedActions.push(ActionHistoryCodifer._encodeAction(actionNode, {addTime: true}))
		);

		if (currentNode) {
			stringifiedActions.push("__________________________________________");
			stringifiedActions.push(
				"error in current action:\n" + ActionHistoryCodifer._encodeAction(currentNode, options)
			);
		}

		if (options.wasViewError) {
			stringifiedActions.push("__________________________________________");
			stringifiedActions.push("error in view");
		}

		return stringifiedActions.join("\n");
	}

	protected static _encodeAction(
		actionNode: ActionTreeNode,
		options?: Partial<{
			truncateLongMessages: boolean;
			addTime: boolean;
			addArrowFunctions: boolean;
			showSubActions: boolean;
		}>,
		depth: number = 0
	) {
		options = ObjectUtil.defaultOptions(options, {
			truncateLongMessages: true,
		});
		var truncateText = "...";
		var stringifiedVal: string = ActionHistoryCodifer._stringifyArgs(actionNode);
		var actionRecordLength: number = options.truncateLongMessages && stringifiedVal.length;
		var maxRecordLength: number = 100;
		if (actionRecordLength > maxRecordLength - truncateText.length)
			stringifiedVal = stringifiedVal.substring(0, maxRecordLength) + truncateText;

		var timeString = "";

		if (options.addTime) {
			var outString = "";
			if (depth === 0) outString = StringUtil.timeToDescTime(actionNode.time);

			timeString = StringUtil.padStart(outString, 15, "");
		}

		var outputArray = [];
		var actionString =
			timeString + (options.addArrowFunctions ? " () => " : " ") + actionNode.name + "(" + stringifiedVal + "), ";
		actionString = StringUtil.pad(depth * 2, " ") + actionString;

		outputArray.push(actionString);
		if (actionNode.whereActionExecutionStop && !ActionHistoryCodifer._subActionHasError(actionNode.subActions)) {
			outputArray.push(StringUtil.pad(depth * 2 + 18, " ") + `ERROR! ${actionNode.whereActionExecutionStop}`);
		}

		if (options.showSubActions) {
			for (var subAction of actionNode.subActions)
				outputArray.push(ActionHistoryCodifer._encodeAction(subAction, options, depth + 1));
		}

		return outputArray.join("\n");
	}

	protected static _subActionHasError(subActions) {
		var foundError = false;
		for (let sub of subActions) {
			if (sub.whereActionExecutionStop) foundError = true;
			else foundError = ActionHistoryCodifer._subActionHasError(sub.subActions);

			if (foundError) break;
		}

		return foundError;
	}

	protected static _stringifyArgs(action: ActionTreeNode): string {
		var parsedArgList = [];
		action.args.forEach((arg) => {
			if (arg === null) parsedArgList.push("null");
			switch (typeof arg) {
				case "string":
					parsedArgList.push(`"${arg}"`);
					break;
				case "number":
					parsedArgList.push(arg.toString());
					break;
				case "boolean":
					parsedArgList.push(arg.toString());
					break;
				case "object":
					try {
						parsedArgList.push(JSON.stringify(arg));
					} catch (error) {
						parsedArgList.push(arg.toString());
					}
					break;
			}
		});

		return parsedArgList.join();
	}

	protected static _processBeforeStringify(
		actionList: ActionTreeNode[],
		namesReplacementMap: Map<string, string>
	): ActionTreeNode[] {
		actionList.forEach((action: ActionTreeNode) => {
			action.name = this._replaceName(action.name, namesReplacementMap);
		});
		return actionList;
	}

	protected static _replaceName(name: string, namesReplacementMap: Map<string, string>) {
		for (var [key, value] of namesReplacementMap.entries()) {
			return name.replace(key, value);
		}
	}
}

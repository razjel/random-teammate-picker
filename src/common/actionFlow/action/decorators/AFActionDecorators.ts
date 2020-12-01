/*
 * a
 */

/*
 * a
 */

import {FunctionUtil} from "../../../util/FunctionUtil";
import {IAFActionDecoratorOptions} from "../interfaces/IAFActionDecoratorOptions";
import {IAFAsyncActionDecoratorOptions} from "../interfaces/IAFAsyncActionDecoratorOptions";
import {AFActionRouter} from "../router/AFActionRouter";
import {AFActionTreeLogging} from "../router/AFActionTreeLogging";
import {AFActionDecoratorsConst} from "./AFActionDecoratorsConst";

interface IClassData {
	prototype;
	constructor;
	actionThisArg;
}

export function afAction(actionName: string, options: IAFActionDecoratorOptions = {}): Function {
	return function (classConstructorOrPrototype, propName, desc) {
		var classData: IClassData = getClassData(classConstructorOrPrototype);
		var originalAction: Function = desc.value;
		AFActionRouter.registerAction(
			actionName,
			classData.constructor,
			classData.actionThisArg,
			originalAction,
			options
		);
		if (options.excludeFromActionTree) AFActionTreeLogging.actionsExcludedFromActionTreeAndHistory.push(actionName);
		desc.value = function (...args) {
			return AFActionRouter.executeAction(actionName, args, this);
		};
		FunctionUtil.changeFunctionName(desc.value, originalAction.name);
		desc.value[AFActionDecoratorsConst.propNameActionName] = actionName;
		return desc;
	};
}

export function afAsyncAction(actionName: string, options: IAFAsyncActionDecoratorOptions = {}): Function {
	return function (classConstructorOrPrototype, propName, desc) {
		var classData: IClassData = getClassData(classConstructorOrPrototype);
		var originalAction = desc.value;
		AFActionRouter.registerAsyncAction(
			actionName,
			classData.constructor,
			classData.actionThisArg,
			originalAction,
			options
		);
		if (options.excludeFromActionTree) AFActionTreeLogging.actionsExcludedFromActionTreeAndHistory.push(actionName);
		desc.value = function (...args) {
			return AFActionRouter.executeAsyncAction(actionName, args, this);
		};
		FunctionUtil.changeFunctionName(desc.value, originalAction.name);
		desc.value[AFActionDecoratorsConst.propNameActionName] = actionName;
		return desc;
	};
}

export function afProcess(actionName: string, options: IAFAsyncActionDecoratorOptions = {}): Function {
	return function (classConstructorOrPrototype, propName, desc) {
		var classData: IClassData = getClassData(classConstructorOrPrototype);
		classConstructorOrPrototype[AFActionDecoratorsConst.propNameActionName] = actionName;
		var originalFunction = desc.value;
		if (isDecoratorForStaticExecute(classConstructorOrPrototype))
			AFActionRouter.registerProcess(actionName, classData.constructor, options);
		else classData.prototype[AFActionDecoratorsConst.propNameOrgExecute] = desc.value;
		if (options.excludeFromActionTree) AFActionTreeLogging.actionsExcludedFromActionTreeAndHistory.push(actionName);
		desc.value = function (...args) {
			return AFActionRouter.executeProcess(actionName, args, this);
		};
		FunctionUtil.changeFunctionName(desc.value, originalFunction.name);
		return desc;
	};
}
function getClassData(classConstructorOrPrototype): IClassData {
	if (isDecoratorForStaticExecute(classConstructorOrPrototype))
		return {
			constructor: classConstructorOrPrototype,
			prototype: classConstructorOrPrototype.prototype,
			actionThisArg: classConstructorOrPrototype,
		} as IClassData;
	else
		return {
			constructor: classConstructorOrPrototype.constructor,
			prototype: classConstructorOrPrototype,
			actionThisArg: undefined,
		} as IClassData;
}

function isDecoratorForStaticExecute(classConstructorOrPrototype): boolean {
	return typeof classConstructorOrPrototype === "function";
}

/*
 * a
 */

/*
 * a
 */

import _ from "underscore";
import {ArrayUtil} from "../../../util/ArrayUtil";
import {PromiseUtil} from "../../../util/PromiseUtil";
import {ActionFlowLogging} from "../../debug/ActionFlowLogging";
import {ActionTreeNode} from "../../debug/actionTree/ActionTreeNode";
import {DebugModel} from "../../debug/panel/DebugModel";
import {ViewValidator} from "../../validation/ViewValidator";
import {AFAsyncData} from "../data/AFAsyncData";
import {AFAsyncMarker} from "../data/AFAsyncMarker";
import {AFActionDecoratorsConst} from "../decorators/AFActionDecoratorsConst";
import {IAFActionDecoratorOptions} from "../interfaces/IAFActionDecoratorOptions";
import {IAFAsyncActionDecoratorOptions} from "../interfaces/IAFAsyncActionDecoratorOptions";
import {IAFAsyncAPI} from "../interfaces/IAFAsyncAPI";
import {IAFExecuteActionData} from "../interfaces/IAFExecuteActionData";
import {IAFPromise} from "../interfaces/IAFPromise";
import {AFBaseProcess} from "../process/AFBaseProcess";
import {AFLegacyBaseProcess} from "../process/AFLegacyBaseProcess";
import {AFActionTreeLogging} from "./AFActionTreeLogging";

interface IRegisteredActionEntry {
	actionThisArg?: any;
	actionFunction: Function;
	actionConstructor: any;
	decoratorOptions?: any;
}

/**
 * examples:
 * "myAction" - explicitly passing action name
 * MyActions.asyncAction - function decorated with @afAsyncAction
 * MyProcess - class decorated with @afProcess
 * asyncData - instance of AFAsyncData class
 */
export type DataWithExtractableActionName = string | Function | AFLegacyBaseProcess | AFBaseProcess | AFAsyncData;

export class AFActionRouter {
	/** @deprecated
	 * old comment: when true no actions are called but action history is build
	 * new comment: playback manager will probably be removed */
	public static dryRun = false;

	/** key: action name, value: all callbacks */
	private static actionHookMap = new Map<string, any[]>();
	/** key: action uid */
	private static workingAsyncActions = new Map<string, AFAsyncData>();

	/** key: actionName */
	private static registeredActions = new Map<string, IRegisteredActionEntry>();
	/** key: actionName */
	private static registeredAsyncActions = new Map<string, IRegisteredActionEntry>();
	/** key: actionName */
	private static registeredProcesses = new Map<string, IRegisteredActionEntry>();

	public static legacy_singularProcesses = new Map<typeof AFLegacyBaseProcess, AFLegacyBaseProcess>();

	//-------------------------------
	//  prototyping
	//-------------------------------
	protected static currentActionData: AFAsyncData;

	//---------------------------------------------------------------
	//
	//      main logic
	//
	//---------------------------------------------------------------

	public static registerAction(
		actionName: string,
		actionConstructor,
		actionThisArg: any,
		actionFunction: Function,
		decoratorOptions: IAFActionDecoratorOptions = {}
	): void {
		AFActionRouter.registeredActions.set(actionName, {
			actionConstructor,
			actionThisArg,
			actionFunction,
			decoratorOptions,
		} as IRegisteredActionEntry);
	}

	public static registerAsyncAction(
		actionName: string,
		actionConstructor,
		actionThisArg: any,
		actionFunction: Function,
		decoratorOptions: IAFAsyncActionDecoratorOptions = {}
	): void {
		AFActionRouter.registeredAsyncActions.set(actionName, {
			actionConstructor,
			actionThisArg,
			actionFunction,
			decoratorOptions,
		} as IRegisteredActionEntry);
	}

	public static registerProcess(
		actionName: string,
		actionConstructor: typeof AFLegacyBaseProcess | typeof AFBaseProcess,
		decoratorOptions: IAFAsyncActionDecoratorOptions = {}
	): void {
		AFActionRouter.registeredProcesses.set(actionName, {
			actionConstructor,
			decoratorOptions,
			actionFunction: null,
		} as IRegisteredActionEntry);
	}

	public static execute(action: DataWithExtractableActionName, args: any[]): IAFPromise | any {
		var actionName: string = AFActionRouter.getActionName(action);
		if (AFActionRouter.registeredActions.get(actionName)) return AFActionRouter.executeAction(actionName, args);
		else if (AFActionRouter.registeredAsyncActions.get(actionName))
			return AFActionRouter.executeAsyncAction(actionName, args);
		else if (AFActionRouter.registeredProcesses.get(actionName))
			return AFActionRouter.executeProcess(actionName, args);
		else console.log("there isn't any action registered under this name: ", actionName);
	}

	//-------------------------------
	//  action
	//-------------------------------

	public static executeAction(actionName: string, args: any[], thisArg?): any {
		var executeData: IAFExecuteActionData = {actionName, args, thisArg};
		var result: any;
		AFActionRouter.preExecuteAction(executeData);
		try {
			result = executeData.action.apply(executeData.thisArg, args);
			AFActionRouter._callActionHooks(actionName, args);
		} finally {
			AFActionRouter.postExecuteAction(executeData);
		}
		return result;
	}

	public static preExecuteAction(executeData: IAFExecuteActionData) {
		var actionEntry: IRegisteredActionEntry = AFActionRouter.registeredActions.get(executeData.actionName);
		executeData.action = actionEntry.actionFunction;
		executeData.thisArg = AFActionRouter.validateAndReturnActionThisArg(actionEntry, executeData.thisArg);
		executeData.args = AFActionRouter.trimActionArguments(executeData.args);
		executeData.decoratorOptions = actionEntry.decoratorOptions;
		AFActionTreeLogging.preSyncAction(executeData);
	}

	public static postExecuteAction(executeData: IAFExecuteActionData) {
		AFActionTreeLogging.postSyncAction(executeData);
	}

	//-------------------------------
	//  async action
	//-------------------------------

	public static executeAsyncAction(actionName: string, args: any[], thisArg?): IAFPromise {
		var executeData: IAFExecuteActionData = {actionName, args, thisArg};
		AFActionRouter.preExecuteAsyncAction(executeData);
		var promise: Promise<any>;
		try {
			promise = executeData.action.apply(executeData.thisArg, args);
		} catch (error) {
			promise = Promise.reject(error);
		}
		return AFActionRouter.postExecuteAsyncAction(executeData, promise) as any;
	}

	public static preExecuteAsyncAction(executeData: IAFExecuteActionData) {
		var actionEntry: IRegisteredActionEntry = AFActionRouter.registeredAsyncActions.get(executeData.actionName);
		executeData.action = actionEntry.actionFunction;
		executeData.thisArg = AFActionRouter.validateAndReturnActionThisArg(actionEntry, executeData.thisArg);
		executeData.args = AFActionRouter.trimActionArguments(executeData.args);
		executeData.asyncData = AFActionRouter.createNewAsyncData(actionEntry, executeData);
		executeData.thisArg.asyncAPI = executeData.asyncData.api;
		executeData.decoratorOptions = actionEntry.decoratorOptions;
		AFActionTreeLogging.preAsyncAction(executeData);
	}

	public static postExecuteAsyncAction(executeData: IAFExecuteActionData, promise: Promise<any>): IAFPromise {
		AFActionRouter.clearCurrentAsyncDataIfSame(executeData.asyncData);
		AFActionTreeLogging.postAsyncAction(executeData);
		return AFActionRouter.wrapAsyncActionPromise(executeData.asyncData, promise);
	}

	//-------------------------------
	//  process
	//-------------------------------

	public static executeProcess(actionName: string, args: any[], thisArg?): IAFPromise {
		var executeData: IAFExecuteActionData = {actionName, args, thisArg};
		AFActionRouter.preExecuteProcess(executeData);
		//TODO razjel: legacy code start
		if ((executeData.asyncData.processInstance as AFLegacyBaseProcess).pbxLib) {
			var baseProcess = executeData.asyncData.processInstance as AFLegacyBaseProcess;
			var promise: Promise<any> = baseProcess.pbxLib._promise;
			try {
				executeData.action.apply(executeData.thisArg, args);
			} catch (error) {
				baseProcess.pbxLib._promiseReject(error);
			}
		} else {
			//TODO razjel: legacy code end
			var promise: Promise<any>;
			try {
				promise = executeData.action.apply(executeData.thisArg, args);
			} catch (error) {
				promise = Promise.reject(error);
			}
		}
		return AFActionRouter.postExecuteProcess(executeData, promise);
	}

	public static preExecuteProcess(executeData: IAFExecuteActionData) {
		var actionEntry: IRegisteredActionEntry = AFActionRouter.registeredProcesses.get(executeData.actionName);
		var actionConstructor = actionEntry.actionConstructor;
		var processInstance:
			| AFLegacyBaseProcess
			| AFBaseProcess = AFActionRouter.validateAndReturnProcessInstanceIfPossible(
			actionConstructor,
			executeData.thisArg
		);
		var asyncData = AFActionRouter.createNewAsyncData(actionEntry, executeData);

		//TODO razjel: legacy code start
		var singularInstance = AFActionRouter.legacy_singularProcesses.get(
			actionConstructor as typeof AFLegacyBaseProcess
		);
		if (singularInstance) asyncData.processInstance = singularInstance;
		if (!asyncData.processInstance) {
			//TODO razjel: legacy code end
			asyncData.processInstance = processInstance || new actionConstructor();
		}

		//TODO razjel: legacy code start
		if ((asyncData.processInstance as AFLegacyBaseProcess).pbxLib) {
			var baseProcess = asyncData.processInstance as AFLegacyBaseProcess;
			if (!baseProcess.pbxLib._promise) {
				var promise = new Promise((resolve, reject) => {
					baseProcess.pbxLib._promiseResolve = resolve as null;
					baseProcess.pbxLib._promiseReject = reject as null;
				});
				baseProcess.pbxLib._promise = promise as null;
			}
			if (baseProcess.pbxLib.singular) {
				AFActionRouter.legacy_singularProcesses.set(
					actionConstructor as typeof AFLegacyBaseProcess,
					baseProcess
				);
			}
		}
		//TODO razjel: legacy code end
		(asyncData.processInstance as AFBaseProcess).asyncAPI = asyncData.api;

		var actionFunction = asyncData.processInstance[AFActionDecoratorsConst.propNameOrgExecute];
		executeData.action = actionFunction;
		executeData.asyncData = asyncData;
		executeData.thisArg = asyncData.processInstance;
		executeData.decoratorOptions = actionEntry.decoratorOptions;
		AFActionTreeLogging.preAsyncAction(executeData);
	}

	public static postExecuteProcess(executeData: IAFExecuteActionData, promise: Promise<any>): IAFPromise {
		AFActionRouter.clearCurrentAsyncDataIfSame(executeData.asyncData);
		AFActionTreeLogging.postAsyncAction(executeData);
		return AFActionRouter.wrapAsyncActionPromise(executeData.asyncData, promise);
	}

	//-------------------------------
	//  common async
	//-------------------------------

	private static validateAndReturnActionThisArg(actionEntry: IRegisteredActionEntry, actionThisArg) {
		if (!actionEntry.actionThisArg) {
			//TODO razjel: SpiritTestUtil.createComponents is called via T.createComponents
			// which extends SpiritTestUtil and this error disallows this
			//if (!AFActionRouter.isInstanceOfClass(actionEntry.actionConstructor, actionThisArg)) {
			//	throw new Error(
			//		`action defined as non static class member must have "this" pointing to class instance`);
			//}
			return actionThisArg;
		}
		return actionEntry.actionThisArg;
	}

	private static validateAndReturnProcessInstanceIfPossible(actionConstructor, actionThisArg) {
		if (actionThisArg) {
			if (AFActionRouter.isInstanceOfClass(actionConstructor, actionThisArg)) {
				return actionThisArg;
			} else if (actionConstructor !== actionThisArg) {
				throw new Error(
					`process must have "this" pointing to class constructor (static execute) or class instance (execute on instance)`
				);
			}
		}
		return null;
	}

	private static createNewAsyncData(
		actionEntry: IRegisteredActionEntry,
		executeData: IAFExecuteActionData
	): AFAsyncData {
		var asyncData = new AFAsyncData();
		asyncData.actionName = executeData.actionName;
		asyncData.actionArgs = executeData.args;
		asyncData.actionConstructor = actionEntry.actionConstructor;
		asyncData.playbackBlocking = (actionEntry.decoratorOptions as IAFAsyncActionDecoratorOptions).playbackBlocking;
		asyncData.api = AFActionRouter.createAsyncAPI(asyncData);
		AFActionRouter.workingAsyncActions.set(asyncData.uid, asyncData);
		if (AFActionRouter.currentActionData) {
			asyncData.parentUID = AFActionRouter.currentActionData.uid;
			AFActionRouter.currentActionData.childUID = asyncData.uid;
		}
		AFActionRouter.setCurrentAsyncData(asyncData);
		return asyncData;
	}

	private static createAsyncAPI(asyncData: AFAsyncData): IAFAsyncAPI {
		return {
			uid: asyncData.uid,
			terminate: AFActionRouter.externalTerminate.bind(null, asyncData),
			callOnTerminate: (callback) => {
				asyncData.terminateCallback = callback;
			},
			endIfTerminated: () => {
				if (asyncData.isTerminated) throw AFAsyncMarker.TERMINATE;
			},
			wrapPromise: (promise) => {
				//TODO razjel: I think that it can be cleared regardless of current data
				AFActionRouter.clearCurrentAsyncData();
				try {
					if (!PromiseUtil.isPromise(promise)) return promise;
				} catch (error) {
					return promise;
				}
				return promise
					.then((result) => {
						if (asyncData.isTerminated) throw AFAsyncMarker.TERMINATE;
						AFActionRouter.setCurrentAsyncData(AFActionRouter.workingAsyncActions.get(asyncData.uid));
						return result;
					})
					.catch((error) => {
						if (asyncData.isTerminated) throw AFAsyncMarker.TERMINATE;
						throw error;
					});
			},
			isTerminated: () => asyncData.isTerminated,
			killAllExceptMe: () => {
				var allMyTypeAsyncData: AFAsyncData[] = AFActionRouter.getAsyncActions(asyncData);
				allMyTypeAsyncData.forEach((otherAsyncData) => {
					if (otherAsyncData !== asyncData) otherAsyncData.api.terminate();
				});
			},
		};
	}

	private static wrapAsyncActionPromise(asyncData: AFAsyncData, promise: Promise<any>): IAFPromise {
		var wrapPromise: IAFPromise = new Promise((resolve, reject) => {
			asyncData.wrapReject = reject;
			if (asyncData.terminateWasCalledSynchronously) {
				if (asyncData.isRejected) reject(asyncData.rejectReason);
				else AFActionRouter.finishWholeAsyncChainWithTerminate(asyncData);
			} else {
				promise
					.then((result) => {
						if (asyncData.parentUID) {
							AFActionRouter.setCurrentAsyncData(
								AFActionRouter.workingAsyncActions.get(asyncData.parentUID)
							);
						} else {
							AFActionRouter.clearCurrentAsyncData();
						}
						AFActionRouter.finishAsyncAction(asyncData);
						resolve(result);
					})
					.catch((error) => {
						AFActionRouter.finishAsyncActionWithError(asyncData, error);
					});
			}
		});
		wrapPromise.terminate = AFActionRouter.externalTerminate.bind(null, asyncData);
		asyncData.promise = wrapPromise;
		return wrapPromise;
	}

	private static externalTerminate(asyncData: AFAsyncData) {
		if (asyncData.wrapReject) {
			AFActionRouter.finishWholeAsyncChainWithTerminate(asyncData);
		} else {
			asyncData.terminateWasCalledSynchronously = true;
		}
	}

	private static finishWholeAsyncChainWithTerminate(asyncData: AFAsyncData) {
		AFActionRouter.buildAsyncActionChainBottomFirst(asyncData).forEach((chainAsyncData) => {
			// theoretically only bottom async needs to call reject and whole chain will reject nicely but it will
			// happen asynchronously, because handling reject and resolve is done in next frame, and I want to make
			// this synchronous thus manually calling reject on each async
			//TODO razjel: it is required only for externalTerminate call, maybe do this with single terminate?
			AFActionRouter.finishAsyncActionWithError(chainAsyncData, AFAsyncMarker.TERMINATE);
		});
	}

	private static finishAsyncActionWithError(asyncData: AFAsyncData, error) {
		if (asyncData.isRejected) return;
		asyncData.isRejected = true;
		asyncData.isTerminated = error === AFAsyncMarker.TERMINATE;
		if (asyncData.isTerminated && asyncData.terminateCallback) {
			try {
				asyncData.terminateCallback();
			} catch (callbackError) {
				error = callbackError;
			}
		}
		var wrapReject = asyncData.wrapReject;
		AFActionRouter.finishAsyncAction(asyncData);
		if (wrapReject) {
			wrapReject(error);
		} else {
			asyncData.terminateWasCalledSynchronously = true;
			asyncData.rejectReason = error;
		}
	}

	private static finishAsyncAction(asyncData: AFAsyncData) {
		if (process.env.isE2eTest) ViewValidator.validateViews();

		if (!AFActionRouter.workingAsyncActions.has(asyncData.uid)) return;
		//TODO razjel: legacy code start
		if (AFActionRouter.legacy_singularProcesses.get(asyncData.actionConstructor as typeof AFLegacyBaseProcess))
			AFActionRouter.legacy_singularProcesses.delete(asyncData.actionConstructor as typeof AFLegacyBaseProcess);
		//TODO razjel: legacy code end
		if (asyncData.parentUID) {
			var parentAsyncData = AFActionRouter.workingAsyncActions.get(asyncData.parentUID);
			if (parentAsyncData) parentAsyncData.childUID = null;
		} else {
			//TODO razjel: push to ActionTree bo to jest akcja root
		}
		AFActionRouter.workingAsyncActions.delete(asyncData.uid);
		asyncData.childUID = null;
		asyncData.parentUID = null;
		asyncData.promise = null;
		asyncData.terminateCallback = null;
		asyncData.api = null;
		//TODO razjel: make it work with nullify
		//TODO razjel: nullify can't be used because of "rejectReason" which must be left longer
		//ObjectUtil.nullifyAllProps(asyncData, {excludeString: true});
		if (!asyncData.isRejected) AFActionRouter._callActionHooks(asyncData.actionName, asyncData.actionArgs);
	}

	//-------------------------------
	//  action hooks
	//-------------------------------

	/** @deprecated */
	public static registerOnPreAction(action: Function | string, callback: any) {
		throw new Error("registering on pre action is deprecated");
	}

	public static registerOnPostAction(action: DataWithExtractableActionName, callback: any) {
		var actionName = AFActionRouter.getActionName(action);
		var callbackList: any[] = AFActionRouter.actionHookMap.get(actionName);
		if (!callbackList) {
			callbackList = [];
			AFActionRouter.actionHookMap.set(actionName, callbackList);
		}
		callbackList.push(callback);
	}

	private static _callActionHooks(actionName: string, args?: any[]) {
		if (ActionFlowLogging.shouldLogPostHandlers(actionName)) console.debug("post action:", actionName);

		var callbacks: any[] = AFActionRouter.actionHookMap.get(actionName);
		if (callbacks && callbacks.length > 0)
			callbacks.forEach((callback) => {
				try {
					//TODO razjel: adding actionName as last argument is bad need to do other way
					args.push(actionName);
					callback.apply(this, args);
				} catch (error) {
					if (process.env.isDebug) throw error;
					else console.log(error);
				}
			});
	}

	/** @deprecated */
	public static unregisterOnPreAction(action: Function | string, callback: any) {
		throw new Error("registering on pre action is deprecated");
	}

	public static unregisterOnPostAction(action: DataWithExtractableActionName, callback: any) {
		var actionName = AFActionRouter.getActionName(action);
		var callbackList: any[] = AFActionRouter.actionHookMap.get(actionName);
		if (!callbackList) return;
		ArrayUtil.removeItem(callbackList, callback);
	}

	//-------------------------------
	//  async tools
	//-------------------------------

	public static printActionChain(asyncUID: string) {
		let asyncData = this.workingAsyncActions.get(asyncUID);
		let parentUID = asyncData.parentUID;
		const names = [asyncData.actionName];
		while (parentUID) {
			asyncData = this.workingAsyncActions.get(parentUID);
			names.unshift(asyncData.actionName);
			parentUID = asyncData.parentUID;
		}
		console.log(names.join(`->`));
	}

	public static getFirstAsyncAction(objectWithActionName: DataWithExtractableActionName): AFAsyncData {
		var actionName = AFActionRouter.getActionName(objectWithActionName);
		if (!actionName) {
			throw new Error(
				"to get action data you must pass object that has action name, " +
					"either process class or action function"
			);
		}
		return _.findWhere(this.getAllAsyncActions(), {actionName: actionName});
	}

	public static getAsyncActions(objectWithActionName: DataWithExtractableActionName): AFAsyncData[] {
		var actionName = AFActionRouter.getActionName(objectWithActionName);
		if (!actionName) {
			throw new Error(
				"to get action data you must pass object that has action name, " +
					"either process class or action function"
			);
		}
		return _.where(this.getAllAsyncActions(), {actionName: actionName});
	}

	public static getAllAsyncActions(): AFAsyncData[] {
		return Array.from(AFActionRouter.workingAsyncActions.values());
	}

	public static terminateFirstAsyncAction(objectWithActionName: DataWithExtractableActionName) {
		let asyncData: AFAsyncData = AFActionRouter.getFirstAsyncAction(objectWithActionName);
		asyncData && asyncData.api.terminate();
	}

	public static terminateAsyncActions(objectWithActionName: DataWithExtractableActionName) {
		let allAsyncData: AFAsyncData[] = AFActionRouter.getAsyncActions(objectWithActionName);
		allAsyncData.forEach((asyncData) => asyncData.api.terminate());
	}

	public static terminateAllAsyncActions(excludedActionNameOrActionOrAsyncData?: DataWithExtractableActionName) {
		var allActions: AFAsyncData[] = AFActionRouter.getAllAsyncActions();
		while (allActions.length) {
			var asyncData: AFAsyncData = allActions.shift();
			if (asyncData.isTerminated) {
				continue;
			}

			if (excludedActionNameOrActionOrAsyncData) {
				var asyncDataChain: AFAsyncData[] = AFActionRouter.buildAsyncActionChainBottomFirst(asyncData);
				var terminateChain = true;
				for (var asyncDataFromChain of asyncDataChain) {
					if (excludedActionNameOrActionOrAsyncData instanceof AFAsyncData) {
						if (asyncDataFromChain === excludedActionNameOrActionOrAsyncData) terminateChain = false;
					} else {
						var actionName = AFActionRouter.getActionName(excludedActionNameOrActionOrAsyncData);
						if (asyncDataFromChain.actionName === actionName) terminateChain = false;
					}
					if (!terminateChain) break;
				}
				if (terminateChain) {
					asyncDataChain[0].api.terminate();
				} else {
					asyncDataChain.forEach((asyncDataFromChain) => {
						var index = allActions.indexOf(asyncDataFromChain);
						if (index !== -1) allActions.splice(index, 1);
					});
				}
			} else {
				asyncData.api.terminate();
			}
		}
	}

	//-------------------------------
	//  other tools
	//-------------------------------

	public static markCurrentActionAsEmpty() {
		var currNode = AFActionTreeLogging.actionTree && AFActionTreeLogging.actionTree.getCurrentNode();
		if (currNode) currNode.empty = true;
	}

	public static isCurrentOrLastActionEmpty(): boolean {
		var atn: ActionTreeNode = AFActionTreeLogging.actionTree && AFActionTreeLogging.actionTree.getCurrentNode();
		if (!atn && DebugModel.inst.actionTree.length)
			atn = DebugModel.inst.actionTree.get(DebugModel.inst.actionTree.length - 1);
		return atn ? atn.empty : false;
	}

	public static clean() {
		AFActionRouter.terminateAllAsyncActions();
		AFActionRouter.actionHookMap.clear();
	}

	//-------------------------------
	//  internal helpers
	//-------------------------------

	private static getActionName(action: DataWithExtractableActionName): string {
		if (action) {
			if (typeof action === "string") return action;
			else if (AFActionDecoratorsConst.propNameActionName in action)
				return action[AFActionDecoratorsConst.propNameActionName];
			else if (action instanceof AFAsyncData) return action.actionName;
		}
		throw new Error(`Object is not an action: ${action}`);
	}

	private static buildAsyncActionChainBottomFirst(asyncData: AFAsyncData): AFAsyncData[] {
		if (!asyncData) return [];
		while (asyncData.childUID) asyncData = AFActionRouter.workingAsyncActions.get(asyncData.childUID);
		var asyncDataChain: AFAsyncData[] = [asyncData];
		while (asyncData && asyncData.parentUID) {
			asyncData = AFActionRouter.workingAsyncActions.get(asyncData.parentUID);
			if (asyncData) asyncDataChain.push(asyncData);
		}
		return asyncDataChain;
	}

	private static trimActionArguments(args: any[]): any[] {
		if (!args) return [];
		var copiedArgs = args.concat();
		for (var i = 0; i < copiedArgs.length; i++) {
			var isReactEvent = copiedArgs[i] && copiedArgs[i].hasOwnProperty("nativeEvent");
			if (isReactEvent) {
				copiedArgs.length = i;
				break;
			}
		}
		return copiedArgs;
	}

	private static isInstanceOfClass(classConstructor, classInstance) {
		return classInstance && classConstructor === classInstance.constructor;
	}

	private static clearCurrentAsyncDataIfSame(asyncData: AFAsyncData) {
		if (asyncData === AFActionRouter.currentActionData) AFActionRouter.currentActionData = null;
	}

	private static clearCurrentAsyncData() {
		AFActionRouter.currentActionData = null;
	}

	private static setCurrentAsyncData(asyncData: AFAsyncData) {
		AFActionRouter.currentActionData = asyncData;
	}
}

/*
 * a
 */

/*
 * a
 */
import {ActionFlowLogging} from "../../debug/ActionFlowLogging";
import {ActionTree} from "../../debug/actionTree/ActionTree";
import {DebugModel} from "../../debug/panel/DebugModel";
import {IAFExecuteActionData} from "../interfaces/IAFExecuteActionData";

export class AFActionTreeLogging {
	/** util object which builds tree of actions */
	public static actionTree: ActionTree = null;

	public static actionsExcludedFromActionTreeAndHistory = [
		"BrowserFrameManager.nextFrame",
		"SaveAreaActions.checkSafeArea",
		"ViewActions.updateUserPhotoListScrollTop",
		"ViewActions.updateSlideBoxWithNewScrollBarState",
		"ViewActions.updateContentBoxWithNewContentRect",
		"ViewActions.updateSlideBoxWithNewSlideRect",
		"BaseAsyncQueueManager.update",
	];

	/** @deprecated this works only for sync actions if I won't be able to make it work for async, then it
	 * doesn't have sense */
	public static lastActionThrowException = false;

	public static preSyncAction(executeData: IAFExecuteActionData) {
		if (AFActionTreeLogging.canLog(executeData)) {
			if (AFActionTreeLogging.actionTree) {
				AFActionTreeLogging.actionTree.beginAction(
					executeData.actionName,
					AFActionTreeLogging.getArgsForLogging(executeData),
					executeData.action,
					false
				);
				executeData.actionTreeNode = AFActionTreeLogging.actionTree.getCurrentNode();
			}
			if (ActionFlowLogging.shouldLogAction(executeData.actionName, true)) {
				console.debug("begin action:", executeData.actionName, executeData.args && executeData.args.concat());
			}
		}
		executeData.actionTreeNode && (executeData.actionTreeNode.whereActionExecutionStop = "pre");
		executeData.actionTreeNode && (executeData.actionTreeNode.whereActionExecutionStop = "action");
	}

	public static postSyncAction(executeData: IAFExecuteActionData) {
		executeData.actionTreeNode && (executeData.actionTreeNode.whereActionExecutionStop = "post");
		executeData.actionTreeNode && (executeData.actionTreeNode.whereActionExecutionStop = "");
		if (AFActionTreeLogging.canLog(executeData)) {
			AFActionTreeLogging.lastActionThrowException =
				!!executeData.actionTreeNode && !!executeData.actionTreeNode.whereActionExecutionStop;
			if (AFActionTreeLogging.actionTree) {
				AFActionTreeLogging.actionTree.endAction();
				if (AFActionTreeLogging.actionTree.isCurrentNodeRoot()) {
					var wholeTree = AFActionTreeLogging.actionTree.getWholeActionTree();
					DebugModel.inst.actionTree.push(wholeTree);
					DebugModel.inst.validateStoredActionsLength();
					AFActionTreeLogging.actionTree.cleanTree();
				}
			}
			if (ActionFlowLogging.shouldLogAction(executeData.actionName, false))
				console.debug("end action:", executeData.actionName, executeData.args && executeData.args.concat());
		}
	}

	public static preAsyncAction(executeData: IAFExecuteActionData) {
		if (AFActionTreeLogging.canLog(executeData)) {
			if (AFActionTreeLogging.actionTree) {
				AFActionTreeLogging.actionTree.beginAction(
					executeData.actionName,
					AFActionTreeLogging.getArgsForLogging(executeData),
					executeData.action,
					true
				);
				AFActionTreeLogging.actionTree.endAction();
				if (AFActionTreeLogging.actionTree.isCurrentNodeRoot()) {
					var wholeTree = AFActionTreeLogging.actionTree.getWholeActionTree();
					DebugModel.inst.actionTree.push(wholeTree);
					DebugModel.inst.validateStoredActionsLength();
					AFActionTreeLogging.actionTree.cleanTree();
				}
			}
			if (ActionFlowLogging.shouldLogAction(executeData.actionName, true))
				console.debug(
					"begin async action:",
					executeData.actionName,
					executeData.args && executeData.args.concat()
				);
		}
	}

	public static postAsyncAction(executeData: IAFExecuteActionData) {
		if (AFActionTreeLogging.canLog(executeData)) {
			if (ActionFlowLogging.shouldLogAction(executeData.actionName, false))
				console.debug("end process:", executeData.actionName, executeData.args && executeData.args.concat());
		}
	}

	//-------------------------------
	//  utils
	//-------------------------------

	private static canLog(executeData: IAFExecuteActionData): boolean {
		return (
			!executeData.decoratorOptions.excludeFromActionTree &&
			AFActionTreeLogging.actionsExcludedFromActionTreeAndHistory.indexOf(executeData.actionName) === -1
		);
	}

	private static getArgsForLogging(executeData: IAFExecuteActionData): any[] {
		return executeData.decoratorOptions.hideArgumentsInActionTreeLog
			? ["action-with-hidden-args"]
			: executeData.args;
	}
}

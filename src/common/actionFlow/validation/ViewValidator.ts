/*
 * a
 */

/*
 * a
 */

import {ArrayUtil} from "../../util/ArrayUtil";
import {DictUtil} from "../../util/DictUtil";
import {ObjectUtil} from "../../util/ObjectUtil";
import {AFActionRouter} from "../action/router/AFActionRouter";
import {BindData} from "../binding/BindData";
import {IConnectedView} from "../binding/IConnectedView";
import {BrowserFrameManager} from "../BrowserFrameManager";
import {ActionFlowLogging} from "../debug/ActionFlowLogging";

//var ReactUpdates = require('react-dom/lib/ReactUpdates');

export class ViewValidator {
	public static viewValidationPassed = true;

	private static _invalidatedViews: IConnectedView[] = [];

	/**  K: uid:number, V: bindData:BindData **/
	private static _invalidatedBindDatasMap: any = {};

	public static init() {
		if (!process.env.isE2eTest)
			AFActionRouter.registerOnPostAction(
				BrowserFrameManager.nextFrame,
				ViewValidator.validateViews.bind(ViewValidator)
			);
	}

	public static clean() {
		AFActionRouter.unregisterOnPostAction(
			BrowserFrameManager.nextFrame,
			ViewValidator.validateViews.bind(ViewValidator)
		);
		ViewValidator._invalidatedViews = [];
		ViewValidator._invalidatedBindDatasMap = {};
	}

	//---------------------------------------------------------------
	//
	//      accessors
	//
	//---------------------------------------------------------------
	public static addBindData(bindData: BindData): void {
		ViewValidator._invalidatedBindDatasMap[bindData.uid] = bindData;
	}

	public static addAndIvalidate(view: IConnectedView): void {
		view.pbxLib.__invalidate();
		ViewValidator.addView(view);
	}

	public static addView(view: IConnectedView): void {
		ArrayUtil.addIfNotExist(ViewValidator._invalidatedViews, view);
	}

	public static removeBindData(bindData: BindData): void {
		ViewValidator._invalidatedBindDatasMap[bindData.uid] = null;
	}

	public static removeView(view: IConnectedView): void {
		ArrayUtil.removeItem(ViewValidator._invalidatedViews, view);
	}

	//---------------------------------------------------------------
	//
	//      validation
	//
	//---------------------------------------------------------------
	public static validateViews() {
		var invBindDatasMap = ViewValidator._invalidatedBindDatasMap;
		ViewValidator._logViewValidatorStart(invBindDatasMap);

		DictUtil.forEachProperty(invBindDatasMap, (bindData: BindData) => {
			bindData.getViews(true).forEach(ViewValidator.addAndIvalidate);
			if (bindData.changed) bindData.getViews(false).forEach(ViewValidator.addAndIvalidate);
		});

		for (var key in invBindDatasMap) {
			invBindDatasMap[key].reset();
		}

		ViewValidator._invalidatedBindDatasMap = {};

		ViewValidator._logInvalidatedBindDatasMap(invBindDatasMap);

		for (var validationIteration: number = 0; validationIteration < 25; validationIteration++) {
			var invViews: any[] = ViewValidator._invalidatedViews;
			invViews.sort((v1: any, v2: any) => {
				if (!v1._reactInternalInstance || !v2._reactInternalInstance) return 0;
				return v1._reactInternalInstance._mountOrder - v2._reactInternalInstance._mountOrder;
			});

			ViewValidator._logValidatedViews(invViews, validationIteration);

			ViewValidator._invalidatedViews = [];

			for (var i: number = 0; i < invViews.length; i++) {
				var view = invViews[i];
				if (!view._isMounted) {
					if (ActionFlowLogging.__LOG_WHEN_COMPONENT_IS_VALIDATED_WHILE_UNMOUNTED)
						console.log("Validate of unmounted view:", ObjectUtil.className(view));
					continue;
				}

				ViewValidator.viewValidationPassed = false;
				try {
					view.validate();
					//ReactUpdates.flushBatchedUpdates();
					ViewValidator.viewValidationPassed = true;
				} finally {
					if (!ViewValidator.viewValidationPassed) ViewValidator._resetAllBindDataForView(view);
				}
			}
			if (ViewValidator._invalidatedViews.length === 0) break;

			if (validationIteration === 25) throw new Error("Cyclic invalidation");
		}
	}

	//---------------------------------------------------------------
	//
	//      logging
	//
	//---------------------------------------------------------------
	private static _logValidatedViews(invViews, validationIteration) {
		if (ActionFlowLogging.__LOG_VALIDATED_VIEWS) {
			if (invViews.length) console.debug(`pre Views [${validationIteration}] validation`, invViews.concat());
		}
	}

	private static _logViewValidatorStart(invBindDatasMap) {
		if (ActionFlowLogging.__LOG_VALIDATED_BINDDATAS)
			console.debug(
				"ViewValidator.validateViews",
				"invBindDatas.length=",
				DictUtil.getObjectLength(invBindDatasMap)
			);
	}

	private static _logInvalidatedBindDatas(invBindDatasMap) {
		if (ActionFlowLogging.__LOG_VALIDATED_BINDDATAS) {
			var toLog = [];
			DictUtil.forEachProperty(invBindDatasMap, (invBD: BindData) => {
				toLog.push([ObjectUtil.className(invBD.value), invBD.value, invBD]);
			});
			console.debug("BindDatas:", toLog.concat());
		}
	}

	private static _logInvalidatedBindDatasMap(invBindDatasMap) {
		if (ActionFlowLogging.__LOG_VALIDATED_BINDDATAS) {
			var toLog: any[] = [];
			DictUtil.forEachProperty(invBindDatasMap, (invBD: BindData) => {
				var bindData: BindData = invBD;
				var path: string[] = [];
				while (bindData) {
					var bindDataPropName: string = bindData.debug_propName;
					try {
						var parent: BindData = bindData.actionFlow.getParents()[0];
						if (parent.debug_className === "BindArray") {
							var index: number = parent.value.indexOf(bindData.value);
							bindDataPropName = `[${index}]`;
						} else {
							for (var propNameFromParent in parent.propMap) {
								if (parent.value.binds[propNameFromParent] === bindData) {
									bindDataPropName = propNameFromParent;
									break;
								}
							}
						}
						if (bindData.debug_className && bindData.debug_className !== "BindArray")
							bindDataPropName += `(${bindData.debug_className})`;
						path.push(bindDataPropName);
					} catch (error) {}
					bindData = parent;
				}
				path.reverse();
				toLog.push(path.join("."));
				ActionFlowLogging.__LOG_VALIDATED_BINDDATAS_PROPS.forEach((prop: string) => {
					if (Array.isArray(invBD[prop])) toLog.push(invBD[prop].concat());
					else toLog.push(invBD[prop]);
				});
			});
			if (toLog.length) console.log("BindDatas:", toLog.concat());
		}
	}

	private static _resetAllBindDataForView(view) {
		var invBindDatasMap = ViewValidator._invalidatedBindDatasMap;

		DictUtil.forEachProperty(invBindDatasMap, (bindData: BindData) => {
			bindData.getViews(true).forEach((foundView) => {
				if (view === foundView) {
					bindData.reset();
					delete invBindDatasMap[bindData.uid];
				}
			});
			bindData.getViews(false).forEach((foundView) => {
				if (view === foundView) {
					bindData.reset();
					delete invBindDatasMap[bindData.uid];
				}
			});
		});
	}
}

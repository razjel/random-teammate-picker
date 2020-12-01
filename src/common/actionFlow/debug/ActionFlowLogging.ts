/*
 * a
 */

/*
 * a
 */

import {ObjectUtil} from "../../util/ObjectUtil";

export class ActionFlowLogging {
	private static ___init(): boolean {
		// this.__LOG = true;
		this.__LOG = false;
		// this.__LOG_VALIDATED_BINDDATAS = true && this.__LOG;
		this.__LOG_VALIDATED_BINDDATAS = false && this.__LOG;

		// this.__LOG_VALIDATED_BINDDATAS_PROPS = ['_shallowBoundViews', '_deeplyBoundViews','_changed',
		// '_childsChanged']; this.__LOG_VALIDATED_BINDDATAS_PROPS = ['uid'];
		this.__LOG_VALIDATED_BINDDATAS_PROPS = [];
		//this.__LOG_VALIDATED_BINDDATAS_VERBOSE = false;
		this.__LOG_VALIDATED_VIEWS = true && this.__LOG;
		// this.__LOG_VALIDATED_VIEWS = false && this.__LOG;
		this.__LOG_CONNECTED_CLASSES = [
			"Slide",
			"SpiritLabelPlayer",
			"CalendarLabel",
			"ContentImagePlayer",
			"EditorOnePageView",
			"AdvancedEditorView",
		];
		this.__LOG_CONNECTED_CLASSES = [];

		//this.__LOG_CALLED_ACTIONS = true && this.__LOG;
		this.__LOG_CALLED_ACTIONS = false && this.__LOG;
		//this.__LOG_ACTIONS_START_AND_FINISH = true && this.__LOG;
		this.__LOG_CALLED_ACTIONS = false && this.__LOG;
		this.__LOG_CALLED_ACTIONS_EXLUDE = ["BrowserFrameManager.nextFrame"];
		//this.__LOG_POST_HANDLERS = true && this.__LOG;
		this.__LOG_POST_HANDLERS = false && this.__LOG;
		this.__LOG_POST_HANDLERS_EXCLUDE = ["BrowserFrameManager.nextFrame"];
		//this.__LOG_WHEN_COMPONENT_IS_INVALIDATED_BY_COMPLEX_OBJECT = true && this.__LOG;
		this.__LOG_WHEN_COMPONENT_IS_INVALIDATED_BY_COMPLEX_OBJECT = false && this.__LOG;
		//this.__LOG_WHEN_COMPONENT_IS_VALIDATED_WHILE_UNMOUNTED = true && this.__LOG;
		this.__LOG_WHEN_COMPONENT_IS_VALIDATED_WHILE_UNMOUNTED = false && this.__LOG;
		return true;
	}

	private static __init = ActionFlowLogging.___init();

	public static __LOG: boolean;
	public static __LOG_CONNECTED_CLASSES: string[];
	public static __LOG_CALLED_ACTIONS: boolean;
	public static __LOG_ACTIONS_START_AND_FINISH: boolean;
	private static __LOG_CALLED_ACTIONS_EXLUDE: any[];

	public static __LOG_POST_HANDLERS: boolean;
	public static __LOG_POST_HANDLERS_EXCLUDE: string[];
	public static __LOG_VALIDATED_BINDDATAS: boolean;
	public static __LOG_VALIDATED_BINDDATAS_PROPS: string[];
	public static __LOG_VALIDATED_VIEWS: boolean;
	public static __LOG_WHEN_COMPONENT_IS_INVALIDATED_BY_COMPLEX_OBJECT: boolean;
	public static __LOG_WHEN_COMPONENT_IS_VALIDATED_WHILE_UNMOUNTED: boolean;

	private static _baseShouldLog(): boolean {
		if (process.env.isProduction) return false;
		if (!ActionFlowLogging.__LOG) return false;
		return true;
	}

	public static shouldLogConnectedComponent(inst: any): any {
		if (!ActionFlowLogging._baseShouldLog()) return false;
		if (ActionFlowLogging.__LOG_CONNECTED_CLASSES)
			return ActionFlowLogging.__LOG_CONNECTED_CLASSES.indexOf(ObjectUtil.className(inst)) !== -1;
		return true;
	}

	public static shouldLogAction(actionName: string, start: boolean): boolean {
		if (
			!ActionFlowLogging._baseShouldLog() ||
			(!ActionFlowLogging.__LOG_CALLED_ACTIONS && !ActionFlowLogging.__LOG_ACTIONS_START_AND_FINISH) ||
			(ActionFlowLogging.__LOG_CALLED_ACTIONS_EXLUDE &&
				ActionFlowLogging.__LOG_CALLED_ACTIONS_EXLUDE.indexOf(actionName) !== -1) ||
			(!start && !ActionFlowLogging.__LOG_ACTIONS_START_AND_FINISH)
		)
			return false;
		return true;
	}

	public static shouldLogPostHandlers(actionName: string): boolean {
		if (!ActionFlowLogging._baseShouldLog()) return false;
		if (!ActionFlowLogging.__LOG_POST_HANDLERS) return false;
		if (ActionFlowLogging.__LOG_POST_HANDLERS_EXCLUDE)
			return ActionFlowLogging.__LOG_POST_HANDLERS_EXCLUDE.indexOf(actionName) === -1;
		return true;
	}
}

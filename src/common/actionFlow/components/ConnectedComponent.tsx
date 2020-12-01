/*
 * a
 */

/*
 * a
 */

import * as React from "react";
import {ArrayUtil} from "../../util/ArrayUtil";
import {ObjectUtil} from "../../util/ObjectUtil";
import {AFActionRouter} from "../action/router/AFActionRouter";
import {BindData} from "../binding/BindData";
import {BindExpression} from "../binding/BindExpression";
import {BindUtil} from "../binding/BindUtil";
import {DeepBind} from "../binding/DeepBind";
import {IConnectedView} from "../binding/IConnectedView";
import {ActionFlowLogging} from "../debug/ActionFlowLogging";
import {ViewValidator} from "../validation/ViewValidator";
import {BaseProps, PropsExcludedFromProcessing} from "./BaseProps";
import {BaseState} from "./BaseState";

export class ConnectedComponent<P = BaseProps, S = BaseState> extends React.Component<P & BaseProps, S & BaseState>
	implements IConnectedView {
	private static sUID: number = 1;
	public uid: number = ConnectedComponent.sUID++;

	protected _setStateForceInvalidate: boolean = false;

	/** map of all binded props passed to the component
	 * K: propName, V:BindData*/
	protected _bindProps: any = {};
	/** map of all binded expressions passed to the component
	 * K: propName, V:BindExpression*/
	protected _bindExpressions: any = {};

	protected _invalid = true;
	protected _invalidProps = true;
	protected _isMounted = false;

	/** K: propName, V:passed property value */
	protected _cachedSimplePropsValues: any = {};
	protected _subscribedMessages: any[];

	/** true when has at least one bindable property or one message
	 * if false, works as usual component*/
	protected _inConnectedMode: boolean = false;

	public renderCounter: number = 0;

	public defaultProps: P = null;

	public pbxLib = {
		__invalidate: () => {
			this._invalidProps = this._invalid = true;
		},
	};

	constructor(props?: P, context?: any) {
		super(props, context);
	}

	//-------------------------------
	//  init
	//-------------------------------

	public UNSAFE_componentWillMount(): void {
		this._isMounted = true;
		this.invalidate();
		this._processProps(this.props);
	}

	//-------------------------------
	//  properties
	//-------------------------------
	public componentWillReceiveProps(nextProps: Readonly<P & BaseProps>): void {
		this._processProps(nextProps);
	}

	protected _processProps(newProps): void {
		this._processBindableProps(newProps);
		this._onNewProps();
		this._processActions();
		this._refreshConnectedMode();
	}

	private _processBindableProps(newProps: P & BaseProps): void {
		ObjectUtil.extendIfNotDefined(newProps, this.defaultProps);

		var newBindDataMap: any = {};
		var newBindExpressionMap: any = {};
		var newCachedSimplePropsValues: any = {};
		var deepBinds: string[] = this.props.deepBinds || [];
		var bindDatasToWhichAddItselfAsView = [];

		var oldBindDatasMap: any = this._bindProps;
		var oldBindExpressionMap: any = this._bindExpressions;
		let anyNonBindablePropsChanged = false;
		for (var key in newProps) {
			if (PropsExcludedFromProcessing.props.indexOf(key) !== -1) continue;

			var val: any = newProps[key];
			if (typeof val === "function") continue;

			var isDeep = false;
			var newBindData: BindData = null;

			if (val) {
				if (val instanceof BindData) newBindData = val;
				else if (val.binds instanceof BindData) newBindData = val.binds;
				else if (val instanceof DeepBind) {
					newBindData = (val as DeepBind).bindData;
					isDeep = true;
				} else if (val.deepBinds instanceof DeepBind) {
					newBindData = (val.deepBinds as DeepBind).bindData;
					isDeep = true;
				} else if (val instanceof BindExpression) {
					var oldExpression = oldBindExpressionMap[key];
					if (oldExpression) oldExpression.dispose();
					oldBindExpressionMap[key] = null;
					var newExpression = val as BindExpression;
					newExpression.view = this;
					newBindExpressionMap[key] = newExpression;
					newProps[key] = newExpression.getValue();
				}
			}
			if (newBindData) {
				//var isDeep = _.contains(deepBinds, key);
				var oldBindData: BindData = oldBindDatasMap[key];
				newBindDataMap[key] = newBindData;

				if (oldBindData === newBindData) {
					oldBindDatasMap[key] = null;
				} else {
					bindDatasToWhichAddItselfAsView.push([newBindData, isDeep]);
					this.invalidate();
				}
				newProps[key] = newBindData.value;
			} else {
				if (!this._invalid && key !== "style") {
					if (val !== this._cachedSimplePropsValues[key]) {
						anyNonBindablePropsChanged = true;
						if (process.env.isDebug) {
							// we can't yet know if component is in connectedMode so it is possible this log will fire
							// when component won't refresh
							if (
								ActionFlowLogging.__LOG_WHEN_COMPONENT_IS_INVALIDATED_BY_COMPLEX_OBJECT &&
								val instanceof Object
							)
								console.debug(
									`ConnectedComponent ${ObjectUtil.className(
										this
									)}, was invalidated by object with key: ${key}`
								);
						}
					}
				}
				newCachedSimplePropsValues[key] = val;
			}
			this._refreshConnectedMode();
			if (this._inConnectedMode && anyNonBindablePropsChanged) {
				this.invalidate();
			}
		}

		//-------------------------------
		//  clean old
		//-------------------------------

		for (let key in oldBindDatasMap) {
			var oldBindData: BindData = oldBindDatasMap[key];
			if (!oldBindData) continue;
			oldBindData.removeView(this);
			this.invalidate();
		}

		for (let key in oldBindExpressionMap) {
			oldExpression = oldBindExpressionMap[key];
			if (oldExpression) oldExpression.dispose();
		}

		for (var addViewArray of bindDatasToWhichAddItselfAsView)
			(addViewArray[0] as BindData).addView(this, addViewArray[1]);

		this._bindProps = newBindDataMap;
		this._bindExpressions = newBindExpressionMap;
		this._cachedSimplePropsValues = newCachedSimplePropsValues;
		(this.props as any) = newProps; //as any because props are readonly in all places except ConnectedComponent
	}

	protected _processActions(): void {
		if (this.props.actions) {
			if (!Array.isArray(this.props.actions))
				throw new Error(
					'Messages passed to Component through property "messages", must be passed as Array, even if only one message is supplied'
				);

			var msgDiff: any = ArrayUtil.diff(this._subscribedMessages, this.props.actions);

			for (var msg of msgDiff.first) {
				AFActionRouter.unregisterOnPostAction(msg, this.bindInvalidate);
			}
			for (var msg of msgDiff.second) {
				AFActionRouter.registerOnPostAction(msg, this.bindInvalidate);
			}
		}
	}

	//-------------------------------
	//  state
	//-------------------------------

	public setState(state: any, callback?: () => any): void {
		if (this._inConnectedMode) {
			this.invalidate(this._setStateForceInvalidate);
		}
		super.setState(state, callback);
	}

	//-------------------------------
	//  should update
	//-------------------------------
	public shouldComponentUpdate(nextProps: Readonly<P & BaseProps>): boolean {
		if (!this._inConnectedMode) return true;
		else if (BindUtil.getValueFromConnectedComponentBindProperty(nextProps.allowParentRender)) return true;
		return false;
	}

	//-------------------------------
	//  validation
	//-------------------------------
	protected bindInvalidate = (updatePropsValues: boolean = true): any => {
		return this.invalidate(updatePropsValues);
	};

	public invalidate(updatePropsValues: boolean = true): any {
		this._invalidProps = this._invalidProps || updatePropsValues;
		if (this._invalid) return;
		this._invalid = true;
		ViewValidator.addView(this);
	}

	public validate(): any {
		if (!this._isMounted) return;
		this._invalid = true;
		if (this._invalidProps) this._updatePropsToNewValuesFromBoundObjects();
		this._invalid = this._invalidProps = false;
		this.forceUpdate();
	}

	protected _updatePropsToNewValuesFromBoundObjects(): void {
		for (var key in this._bindProps) {
			var bd: BindData = this._bindProps[key];
			this.props[key] = bd.value;
		}
		for (var key in this._bindExpressions)
			this.props[key] = (this._bindExpressions[key] as BindExpression).getValue();

		this._onNewProps();
	}

	protected _onNewProps(): void {
		// placeholder for reacting to props new values. Ie setting state based on props
	}

	//-------------------------------
	//  render
	//-------------------------------
	public render(): any {
		this.renderCounter++;
		if (process.env.isDebug && ActionFlowLogging.shouldLogConnectedComponent(this))
			console.debug(
				`${this.uid}: render CC class:`,
				ObjectUtil.className(this),
				"this._isMounted=",
				this._isMounted,
				"this._inConnectedMode=",
				this._inConnectedMode
			);
		this._invalid = this._invalidProps = false;
		return null;
	}

	//-------------------------------
	//  after render
	//-------------------------------
	public componentDidUpdate(): void {}

	public componentDidMount(): void {}

	//-------------------------------
	//  dispose
	//-------------------------------
	public componentWillUnmount(): void {
		this.dispose();
	}

	public dispose(): void {
		this._isMounted = false;
		this._cachedSimplePropsValues = null;
		this.cleanInvalidatingProperties();

		for (var key in this._bindProps) {
			var bd: BindData = this._bindProps[key];
			bd.removeView(this);
		}
		this._bindProps = null;
		ViewValidator.removeView(this);
	}

	//-------------------------------
	//  adding additional bound props
	//-------------------------------
	protected _invalidatingProps: BindData[] = [];

	public addInvalidatingProperty(propOrBindData: any, deep: boolean = false): void {
		this._inConnectedMode = true;
		if (propOrBindData === null || propOrBindData === undefined) {
			if (process.env.isDebug)
				throw new Error(
					`provided property is not bindable property nor BindData. Class:${ObjectUtil.className(this)}`
				);
			else return;
		}

		var bd: BindData;
		if (propOrBindData instanceof BindData) bd = propOrBindData;
		else if (propOrBindData.hasOwnProperty("binds"))
			bd = propOrBindData.binds instanceof BindData ? propOrBindData.binds : propOrBindData.binds.binds;
		else if (process.env.isDebug) {
			throw new Error(
				`provided property is not bindable property nor BindData. Class:${ObjectUtil.className(this)}`
			);
		}
		if (bd && ArrayUtil.addIfNotExist(this._invalidatingProps, bd)) {
			bd.addView(this, deep);
		}
	}

	public removeInvalidatingProperty(propBindData: BindData): void {
		if (ArrayUtil.removeItem(this._invalidatingProps, propBindData)) {
			propBindData.removeView(this);
		}
		this._refreshConnectedMode();
	}

	public cleanInvalidatingProperties(): void {
		for (var bd of this._invalidatingProps) {
			bd.removeView(this);
		}
		this._invalidatingProps.length = 0;
		this._refreshConnectedMode();
	}

	protected _refreshConnectedMode(): void {
		this._inConnectedMode =
			Object.keys(this._bindProps).length > 0 ||
			Object.keys(this._invalidatingProps).length > 0 ||
			(this.props.actions !== undefined && this.props.actions.length > 0);
	}

	//-------------------------------
	//  helpers
	//-------------------------------
	get isMounted(): boolean {
		return this._isMounted;
	}
}

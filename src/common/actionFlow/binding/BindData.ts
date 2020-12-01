import {IConnectedView} from "./IConnectedView";
import {ArrayUtil} from "../../util/ArrayUtil";
import _ from "underscore";
import {ViewValidator} from "../validation/ViewValidator";
import {DeepBind} from "./DeepBind";
import {BindContext} from "./BindContext";
import {ObjectUtil} from "../../util/ObjectUtil";
import {BindUtil} from "./BindUtil";

export class BindData {
	public static sID: number = 0;
	public uid: number = BindData.sID++;

	public propMap = {};
	public deepBindsPropMap = {};
	public value: any;
	public deepBind: DeepBind;
	public disposed: boolean = false;

	protected _deeplyBoundViews: IConnectedView[] = [];
	protected _shallowBoundViews: IConnectedView[] = [];

	protected _parents: BindData[] = [];
	protected _changed: boolean = false;
	protected _childsChanged: boolean = false;

	public context: BindContext;
	public oldValueIsSet: boolean = false;
	public oldValue: any = null;

	//-------------------------------
	//  debug props which are set only when application is in process.env.isDebug mode
	//-------------------------------
	public debug_propName: string;
	public debug_className: string;

	//-------------------------------
	//  construction
	//-------------------------------

	constructor() {
		this.changed = true;
		this.deepBind = new DeepBind(this);
	}

	//-------------------------------
	//  changed
	//-------------------------------

	get changed(): boolean {
		return this._changed;
	}

	set changed(value: boolean) {
		if (this.disposed) return;
		if (value && !this.deepChanged) {
			this._invalidateParents();
		}
		this._changed = value;
		if (this._changed) ViewValidator.addBindData(this);
	}

	protected _invalidateParents(): void {
		for (var key in this._parents) {
			(this._parents[key] as BindData).childsChanged = true;
		}
	}

	get childsChanged(): boolean {
		return this._childsChanged;
	}

	set childsChanged(value: boolean) {
		if (this.disposed) return;
		if (this._childsChanged === value) return;
		this._childsChanged = value;
		if (value) {
			this._invalidateParents();
			ViewValidator.addBindData(this);
		}
	}

	get deepChanged(): boolean {
		return this._changed || this._childsChanged;
	}

	//-------------------------------
	//  validation
	//-------------------------------

	public reset() {
		this._changed = this._childsChanged = false;
	}

	//-------------------------------
	//  parents
	//-------------------------------

	public addParent(parent: BindData): void {
		if (this._parents.indexOf(parent) != -1) return;

		if (process.env.isDebug) {
			if (parent.context && this.context)
				throw new Error("A bind object with context already set is added to a parent with a context");
			if (this._parents.indexOf(parent) != -1)
				throw new Error("You are adding bind parent which was already added before to the child object");
		}
		if (parent.context && !this.context) this.setContext(parent.context);
		this._parents.push(parent);
		parent.childsChanged = this.deepChanged;
	}

	public setContext(context: BindContext): void {
		this.context = context;
		var classData = BindUtil.getClassData(this.value);
		if (classData)
			for (var prop of classData.properties) {
				if (prop.key !== "__type" && prop.bindable) {
					if (!this.propMap[prop.key]) {
						throw new Error(
							`BindData.setContext error for typeName=${classData.typeName} propKey=${prop.key} `
						);
					} else {
						(this.propMap[prop.key] as BindData).setContext(context);
					}
				}
			}
	}

	public removeParent(parent: BindData): void {
		if (this._parents.indexOf(parent) == -1) return;

		if (process.env.isDebug) {
			if (this._parents.indexOf(parent) === -1) {
				throw new Error(
					`You are removing a bind parent from object (${ObjectUtil.className(
						this.value
					)}) which does not have that parent (class:${ObjectUtil.className(parent)})`
				);
			}
		}
		if (parent.context && parent.context === this.context) this.setContext(null);

		this._parents = _.without(this._parents, parent);
	}

	//-------------------------------
	//  views
	//-------------------------------

	public addView(view: IConnectedView, deep = false): void {
		if (deep) ArrayUtil.addIfNotExist(this._deeplyBoundViews, view);
		else ArrayUtil.addIfNotExist(this._shallowBoundViews, view);
	}

	public removeView(view: IConnectedView): void {
		ArrayUtil.removeItem(this._shallowBoundViews, view);
		ArrayUtil.removeItem(this._deeplyBoundViews, view);
	}

	public getViews(deep: boolean): IConnectedView[] {
		return deep ? this._deeplyBoundViews : this._shallowBoundViews;
	}

	//-------------------------------
	//  framework helpers
	//-------------------------------

	public actionFlow = {
		getParents: () => {
			return this._parents;
		},
		getDeepParent: (depth: number = 1): BindData => {
			var parent: BindData = this._parents[0];
			for (var i: number = 1; i < depth; i++) {
				if (parent) parent = parent._parents[0];
				else return null;
			}
			return parent;
		},
		getDeepParentSlideData: (): any => {
			var slideParent;
			if (!this._parents) return;
			this._parents.forEach((parent: BindData) => {
				if (!parent._parents || !parent._parents.length || !parent._parents[0].value) return;
				if (this._isSlideData(parent._parents[0].value)) slideParent = parent._parents[0];
			});
			return slideParent;
		},
		nullify: () => {
			this._parents = null;
			this._deeplyBoundViews = null;
			this._shallowBoundViews = null;
			this.deepBind = null;
			this.disposed = true;
		},
	};

	protected _isSlideData = (value) => {
		//TODO razjel: can't use instanceof, because importing and using SlideData class causes circular dependency
		return value["__type"] === "SlideData";
	};
}

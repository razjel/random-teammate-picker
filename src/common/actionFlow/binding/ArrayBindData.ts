import {BindData} from "./BindData";
import {BindArray} from "./BindArray";
import {BindContext} from "./BindContext";
import {BindUtil} from "./BindUtil";
import _ from "underscore";

export class ArrayBindData extends BindData {
	/** points to itself */
	public binds: ArrayBindData;
	public deepBinds: ArrayBindData;
	/** an array it manages */
	public value: BindArray<any>;

	constructor() {
		super();
		this.binds = this;
	}

	public get(i: number): BindData {
		var value = this.value.get(i);
		if (this.value && value && value.hasOwnProperty("binds")) return this.value.get(i).binds.binds;
		return undefined;
	}

	public attach(elements: any[]): void {
		elements = this._getElementsArray(elements);
		if (!elements) return;

		this.cacheOldValueIfNeeded();
		for (var obj of elements) {
			if (!obj || !obj.hasOwnProperty("binds")) continue;
			var bd: BindData = obj.binds.binds;
			bd.addParent(this);
		}
		this.changed = true;
	}

	/**
	 * @param elements
	 * @param removeCompletly if we remove only one instance (from one index) or all instances
	 */
	public dettach(elements: any | any[], removeCompletly: boolean = true): void {
		elements = this._getElementsArray(elements);
		var u = _;
		if (!elements) return;
		this.cacheOldValueIfNeeded();
		for (var i: number = 0; i < elements.length; i++) {
			var obj = elements[i];
			if (!obj || !obj.hasOwnProperty("binds")) continue;
			var bd: BindData = obj.binds.binds;
			// check if there is only one instance of the object in the array
			if (removeCompletly || this.value.indexOf(obj) === this.value.lastIndexOf(obj)) {
				bd.removeParent(this);
				let captureMode = this.oldValueIsSet;
				if (captureMode) BindUtil.clearOldValues(bd);
			}
		}
		this.changed = true;
	}

	protected _getElementsArray(elements: any): any[] {
		if (!elements) return null;
		if (!Array.isArray(elements)) return [elements];
		if (!elements.length) return null;
		return elements;
	}

	public setContext(context: BindContext): void {
		this.context = context;
		if (this.value)
			for (var obj of this.value) {
				var bd: BindData = BindUtil.getBindData(obj);
				if (bd) bd.setContext(context);
			}
	}

	public cacheOldValueIfNeeded() {
		if (this.context && this.context.captureMode && !this.oldValueIsSet) {
			this.oldValue = this.value.toArray();
			this.oldValueIsSet = true;
		}
	}
}

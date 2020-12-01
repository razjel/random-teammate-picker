/*
 * a
 */

/*
 * a
 */

import _ from "underscore";
import {ArrayChildType, ArrayUtil} from "../../util/ArrayUtil";
import {ObjectUtil} from "../../util/ObjectUtil";
import {AFDataObject} from "./AFDataObject";
import {ArrayBindData} from "./ArrayBindData";
import {BindArray} from "./BindArray";
import {BindData} from "./BindData";
import {BindUtil} from "./BindUtil";
import {CombinedDiff} from "./dataDiff/CombinedDiff";

export class DataDiffUtil {
	//---------------------------------------------------------------
	//
	//      capture
	//
	//---------------------------------------------------------------
	/**
	 * starts registering changes in this object and its childs
	 * - object has to be tree root
	 * - changes will be registered only to both bindable and serializable props
	 * - only changes occuring in last browserframe will be registered
	 * @param obj
	 */
	public static startCapture(obj: AFDataObject): void {
		var bd: BindData = BindUtil.getBindData(obj);
		if (bd.context) bd.context.captureMode = true;
		else if (process.env.isDebug) {
			throw new Error(
				`You try to start capturing changes on a data object (class: ${ObjectUtil.className(
					obj
				)}) which is not a context root (do not have context set).`
			);
		}
	}

	public static endCaptureAndGetDiff(obj: AFDataObject): CombinedDiff {
		var oldVal: any = {};
		var newVal: any = {};
		DataDiffUtil._diff(obj, oldVal, newVal);
		BindUtil.clearOldValues(obj);
		BindUtil.getBindData(obj).context.captureMode = false;
		return new CombinedDiff(oldVal, newVal);
	}

	public static endEmptyCapture(obj: AFDataObject) {
		BindUtil.clearOldValues(obj);
		BindUtil.getBindData(obj).context.captureMode = false;
	}

	private static _diff(obj: AFDataObject, oldVals: any, newVals: any): void {
		//var bd = BindUtil.getBindData(obj)
		var props = BindUtil.getClassData(obj).properties;
		for (var prop of props) {
			if (!prop.serializable || prop.key == "__type") continue;

			var val: any = obj[prop.key];
			var childBD: BindData = obj.binds[prop.key];
			var diff: CombinedDiff;
			if (childBD instanceof ArrayBindData) {
				diff = this._arrayDiff(val as BindArray<any>, childBD);
			} else {
				diff = this._diffObject(val, childBD);
			}
			if (diff) {
				oldVals[prop.key] = diff.oldVal;
				newVals[prop.key] = diff.newVal;
			}
		}
	}

	/**
	 * if one of returned value is:
	 * - obj with __json prop: object was changed to different one or from/to null
	 * - javascript object: object was the same, but childs changed
	 * - value: value changed (it was simple value)
	 *
	 * @param obj
	 * @param childBD
	 * @returns {{oldVal: any, newVal: any}}
	 * @private
	 */
	private static _diffObject(obj: AFDataObject, childBD: BindData): CombinedDiff {
		var oldVal: any = null;
		var newVal: any = null;
		if (childBD.changed && typeof obj === "object") {
			// new complex value set
			oldVal = {__json: JSON.stringify(childBD.oldValue)};
			newVal = {__json: JSON.stringify(childBD.value)};
		} else if (childBD.changed) {
			// simple value changed
			oldVal = childBD.oldValue;
			newVal = childBD.value;
		} else if (childBD.childsChanged) {
			//complex object with props changed inside
			oldVal = {};
			newVal = {};
			this._diff(childBD.value, oldVal, newVal);
		} else return null;

		return new CombinedDiff(oldVal, newVal);
	}

	/**
	 * returned arr has some indexes filled (not all)
	 * for arrays with complex types:
	 *    if val at given index is
	 *        - does not exist: old and new array had the same unchanged obj at the same index
	 *        - obj with __json property: value was missing from second array
	 *        - obj with 'keyString' and '__childsChanged'==false property: index was different,
	 * but content identical
	 *        - obj with 'keyString' and '__childsChanged' == true and other props: complex value
	 * was in the second array (at any index), but its content was changed
	 *
	 * for arrays with simple types, an array with all values is returned
	 */
	private static _arrayDiff(arr: BindArray<any>, arrBD: ArrayBindData): any {
		var newArr: any[] = arr ? arr.toArray() : null; //newVal
		var oldArr: any[] = arrBD.oldValueIsSet ? arrBD.oldValue : newArr; //oldVal

		if (!newArr || !oldArr) {
			return {
				oldVal: {__json: JSON.stringify(oldArr)},
				newVal: {__json: JSON.stringify(newArr)},
			};
		} else if (
			ArrayUtil.getArrayChildsTypes(oldArr, arr.keyString) !== ArrayChildType.COMPLEX_WITH_KEY &&
			ArrayUtil.getArrayChildsTypes(newArr, arr.keyString) !== ArrayChildType.COMPLEX_WITH_KEY
		) {
			return {
				oldVal: oldArr,
				newVal: newArr,
			};
		} else {
			var {first, both, second} = ArrayUtil.indexDiffOfKeyArray(oldArr, newArr, arr.keyString);
			var i: number;

			var oldVal: any[] = [];
			var newVal: any[] = [];
			oldVal.length = oldArr.length;
			newVal.length = newArr.length;

			for (i = 0; i < both.length; i++) {
				var {i1, i2} = both[i];
				var val = newArr[i2];
				var newBD: BindData = val.binds.binds;
				var oldItem, newItem;

				oldItem = {__childsChanged: newBD.childsChanged};
				newItem = {__childsChanged: newBD.childsChanged};
				newItem[arr.keyString] = oldItem[arr.keyString] = val[arr.keyString];
				if (newBD.childsChanged) {
					//complex object with props changed inside
					this._diff(val, oldItem, newItem);
				}
				if (i1 !== i2 || newBD.childsChanged) {
					oldVal[i1] = oldItem;
					newVal[i2] = newItem;
				}
			}
			for (i = 0; i < first.length; i++) {
				i1 = first[i].i1;
				oldVal[i1] = {__json: JSON.stringify(oldArr[i1])};
			}
			for (i = 0; i < second.length; i++) {
				i2 = second[i].i2;
				newVal[i2] = {__json: JSON.stringify(newArr[i2])};
			}
		}
		return {oldVal, newVal};
	}

	//---------------------------------------------------------------
	//
	//      apply
	//
	//---------------------------------------------------------------
	public static applyDiff(data: AFDataObject, diff: any): void {
		DataDiffUtil._applyDiff(data, diff);
	}

	private static _applyDiff(data: AFDataObject, diff: any, keyToOmit: string = ""): any {
		for (var key in diff) {
			if (key === "__childsChanged" || key === "__json" || (keyToOmit && key === keyToOmit)) continue;

			data[key] = this._getObjectAppliedValue(data[key], diff[key]);
		}
		return data;
	}

	private static _getObjectAppliedValue(actualValue: any, diffVal: any): any {
		if (diffVal === null || diffVal === undefined) return diffVal;
		else if (typeof diffVal === "object") {
			if (Array.isArray(diffVal)) {
				return DataDiffUtil._getArrayAppliedValue(actualValue, diffVal);
			}
			//object did not exist or was different. It has to be recreated
			else if (diffVal.hasOwnProperty("__json")) {
				if (diffVal.__json === undefined) return undefined;

				return BindUtil.deserialize(diffVal.__json, null);
			}
			//object was the same, but properties changed
			else {
				return this._applyDiff(actualValue, diffVal);
			}
		}
		//simple value (strings etc)
		else {
			return diffVal;
		}
	}

	/** diff cannot be null */
	private static _getArrayAppliedValue(data: BindArray<any>, diff: any[]): BindArray<any> {
		if (data === null) data = new BindArray<any>();
		var orgArr = data.toArray();

		for (var idx in diff) {
			var diffVal = diff[idx];
			var newVal: any = null;
			if (diffVal && typeof diffVal === "object") {
				if (diffVal.hasOwnProperty("__json")) {
					newVal = BindUtil.deserialize(diffVal.__json, null);
				} else if (diffVal.hasOwnProperty(data.keyString)) {
					var id: string = diffVal[data.keyString];
					var pred: any = {};
					pred[data.keyString] = id;
					newVal = _.findWhere(orgArr, pred);

					if (process.env.isDebug) {
						if (!newVal)
							throw new Error(
								`Object should exist in both arrays. Previous and new one. Keystring: ${id}`
							);
					}
					if (diffVal.__childsChanged) {
						this._applyDiff(newVal, diffVal, data.keyString);
					}
				}
				if (orgArr[idx] !== newVal) {
					data.set(idx as any, newVal);
				}
			} else {
				data.set(idx as any, diffVal);
			}
		}
		data.length = diff.length;
		return data;
	}

	//---------------------------------------------------------------
	//
	//      diff analysis
	//
	//---------------------------------------------------------------
	public static getIndexesOfAddedItemsInDiffArray(diffArr: any[]): number[] {
		var added: number[] = [];
		diffArr.forEach((item, idx) => {
			if (item.hasOwnProperty("__json")) added.push(idx);
		});
		return added;
	}

	public static getIndexesOfChangedItemsInDiffArray(
		diffArr: any[],
		props: string[],
		keyString: string = "idS"
	): number[] {
		var changed: number[] = [];

		diffArr.forEach((item, idx) => {
			if (item.__childsChanged) {
				for (var i: number = 0; i < props.length; i++) {
					if (item.hasOwnProperty(props[i])) {
						changed.push(idx);
						break;
					}
				}
			}
		});

		return changed;
	}
}

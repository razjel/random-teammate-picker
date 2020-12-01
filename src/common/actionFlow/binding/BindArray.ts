import _ from "underscore";
import {ArrayUtil} from "../../util/ArrayUtil";
import {NumberUtil} from "../../util/NumberUtil";
import {AFDataObject} from "./AFDataObject";
import {ArrayBindData} from "./ArrayBindData";
import {BindUtil} from "./BindUtil";

export class BindArray<T> implements AFDataObject {
	public static SERIALIZATION_PROPERTIES = ["__type", "keyString"];
	public binds: this;
	public deepBinds: this;
	public dispose: Function;
	public __type: string;

	public keyString = "id";
	/** for optimization purpose only */
	public containsOnlyUniqueValues = false;

	protected _raw: Array<T>;

	// for typescript
	public length: number;

	//-------------------------------
	//  construction
	//-------------------------------

	constructor(
		initArray?: Array<T>,
		className?: string,
		isContextRoot: boolean = false,
		containsOnlyUniqueValues = false
	) {
		this.__initBind(className, isContextRoot);
		this.containsOnlyUniqueValues = containsOnlyUniqueValues;
		this._raw = initArray || [];
		this.typedBindData.attach(initArray);
		if (process.env.isDebug) {
			Object.defineProperty(this, "0", {
				enumerable: false,
				get: (): T => {
					throw new Error(`Use arr.get(i) instead of arr[i]`);
				},
			});
		}
		Object.defineProperty(this, "length", {
			enumerable: false,
			get: (): number => {
				return this._raw.length;
			},
			set: (val: number) => {
				this.splice(val, Number.MAX_VALUE);
			},
		});
	}

	public __initBind(className: string, isContextRoot: boolean = false): void {
		BindUtil.makeArrayBindable(this, className ? className : "BindArray", isContextRoot);
	}

	[Symbol.iterator](): Iterator<T> {
		return this._raw[Symbol.iterator]();
	}

	public get(i: number): T {
		return this._raw[i];
	}

	public set(i: number, item: T) {
		var oldItem = this._raw[i];
		if (oldItem === item) return;
		if (oldItem) this.typedBindData.dettach([oldItem], this.containsOnlyUniqueValues);
		this.typedBindData.attach([item]);
		this._raw[i] = item;
	}

	get typedBindData(): ArrayBindData {
		return <any>this.binds.binds;
	}

	public remove(...items: T[]): boolean {
		this.typedBindData.dettach(items);
		var wasRemoved = false;
		for (var item of items) {
			if (ArrayUtil.removeItem(this._raw, item)) wasRemoved = true;
		}
		return wasRemoved;
	}

	public clear(): void {
		this.length = 0;
	}

	public removeWhere(predictate: any): T[] {
		var objs = _.where(this._raw, predictate);
		if (!objs.length) return [];
		this.typedBindData.dettach(objs);
		this._raw = _.without(this._raw, ...objs);
		return objs;
	}

	public removeByKey(keyToRemove: string): T {
		var predictate: any = {};
		predictate[this.keyString] = keyToRemove;
		return this.removeWhere(predictate)[0];
	}

	public find(predictate: any): T {
		return this._raw.find(predictate);
	}

	public findWhere(predictate: Partial<T>): T {
		return _.findWhere(this._raw, predictate);
	}

	public getByKey(key: string): T {
		var predictate = {};
		predictate[this.keyString] = key;
		return _.findWhere(this._raw, predictate);
	}

	public move(item: T, newIdx: number): boolean {
		var oldIdx: number = this.indexOf(item);
		if (oldIdx === -1 || oldIdx === newIdx) return false;

		newIdx = NumberUtil.cap(newIdx, 0, this.length - 1);
		this.splice(oldIdx, 1);
		//if (newIdx > oldIdx)
		//	newIdx--;
		this.splice(newIdx, 0, item);
		return true;
	}

	public findIndexWhere(predictate: Partial<T>): number {
		return _.findIndex(this._raw, predictate);
	}

	public findIndex(key: string): number {
		var predictate: any = {};
		predictate[this.keyString] = key;
		return _.findIndex(this._raw, predictate);
	}

	public toJSON(): any {
		return this._raw;
	}

	public toArray(): T[] {
		return this._raw.concat();
	}

	public cloneAF(): this {
		return BindUtil.deserialize(JSON.stringify(this));
	}

	//---------------------------------------------------------------
	//
	//      copied from array
	//
	//---------------------------------------------------------------

	public pushArray(items: BindArray<T> | Array<T>): number {
		if (Array.isArray(items)) return this.push(...(items as Array<T>));
		else return this.push(...(items as BindArray<T>).toArray());
	}

	public push(...items: T[]): number {
		this.typedBindData.attach(items);
		return this._raw.push(...items);
	}

	public pushUniq(...items: T[]) {
		items.forEach((item) => {
			if (!this.contains(item)) this.push(item);
		});
	}

	public pop(): T {
		if (!this._raw.length) return null;
		this.typedBindData.dettach(this._raw[this._raw.length - 1], this.containsOnlyUniqueValues);
		return this._raw.pop();
	}

	public forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void {
		this._raw.forEach(callbackfn, thisArg);
	}

	public reverse(): T[] {
		this.typedBindData.cacheOldValueIfNeeded();
		this.typedBindData.changed = true;
		return this._raw.reverse();
	}

	public shift(): T {
		if (!this._raw.length) return null;
		this.typedBindData.dettach(this._raw[0], this.containsOnlyUniqueValues);
		return this._raw.shift();
	}

	public slice(start?: number, end?: number): T[] {
		return this._raw.slice(start, end);
	}

	public sort(compareFn?: (a: T, b: T) => number): T[] {
		this.typedBindData.cacheOldValueIfNeeded();
		this.typedBindData.changed = true;
		return this._raw.sort(compareFn);
	}

	public splice(start: number, deleteCount: number, ...items: T[]): T[] {
		this.typedBindData.cacheOldValueIfNeeded();
		this.typedBindData.attach(items);
		var objs = this._raw.slice(start, start + deleteCount);
		this.typedBindData.dettach(objs, this.containsOnlyUniqueValues);
		this._raw.splice(start, deleteCount, ...items);
		return objs;
	}

	public unshift(...items: T[]): number {
		this.typedBindData.attach(items);
		return this._raw.unshift(...items);
	}

	public indexOf(searchElement: T, fromIndex?: number): number {
		return this._raw.indexOf(searchElement, fromIndex);
	}

	public lastIndexOf(searchElement: T, fromIndex?: number): number {
		if (fromIndex === undefined) fromIndex = this._raw.length - 1;
		return this._raw.lastIndexOf(searchElement, fromIndex);
	}

	public every(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean {
		return this._raw.every(callbackfn, thisArg);
	}

	public some(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean {
		return this._raw.some(callbackfn, thisArg);
	}

	public map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
		return this._raw.map(callbackfn, thisArg);
	}

	public filter(callbackfn: (value: T, index?: number, array?: T[]) => boolean, thisArg?: any): T[] {
		return this._raw.filter(callbackfn, thisArg);
	}

	public reduce<U = any>(
		callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U,
		initialValue?: U
	): U {
		return this._raw.reduce(callbackfn, initialValue);
	}

	public pluck(key: any): any[] {
		return _.pluck(this._raw, key);
	}

	public contains(searchElement: T): boolean {
		return this._raw.indexOf(searchElement) != -1;
	}

	public isEmpty(): boolean {
		return this._raw.length === 0;
	}
}

/*
 * a
 */

/*
 * a
 */

import _ from "underscore";

export class ArrayUtil {
	// TODO: Is it correct name of the method?
	public static toObject(arr, propName: string): any {
		if (!arr) return null;
		var obj = {};
		arr.forEach((val) => (obj[val[propName]] = val));
		return obj;
	}

	public static addIfNotExist(arr: any[], item): boolean {
		if (!arr || !item) return false;
		if (arr.indexOf(item) == -1) {
			arr.push(item);
			return true;
		}
		return false;
	}

	/** Remove item from array if it is in array
	 *
	 * @param arr array from which remove item - it would be modified
	 * @param item object to remove
	 * @return boolean, if item was removed
	 */
	public static removeItem(arr: any[], item: Object): boolean {
		if (!arr || !item) return false;
		var wasRemoved = false;
		var ind: number = arr.indexOf(item);
		while (ind !== -1) {
			arr.splice(ind, 1);
			ind = arr.indexOf(item, ind);
			wasRemoved = true;
		}
		return wasRemoved;
	}

	/**
	 * Compare items in array and returns object
	 * @return {
	 * first - items in first only
	 * both- items in both
	 * second - items in second only
	 */
	public static diff(arr1: any[], arr2: any[]): {first: any[]; both: any[]; second: any[]} {
		var first = [];
		var both = [];
		var second = [];
		var mark = [];

		if (!arr1) second = arr2 ? arr2.concat() : [];
		else if (!arr2 || !arr2.length) first = arr1.concat();
		else {
			for (var i = 0; i < arr1.length; i++) {
				let indexOf = arr2.indexOf(arr1[i]);
				if (indexOf == -1) {
					//only in first
					first.push(arr1[i]);
				} else {
					// in both
					both.push(arr1[i]);
					mark[indexOf] = true;
				}
			}

			for (var i = 0; i < arr2.length; i++) {
				if (!mark[i]) second.push(arr2[i]);
			}
		}
		return {first, both, second};
	}

	public static diffDict(arr1: any[], arr2: any[]): {first: any[]; both: any[]; second: any[]} {
		var first = [];
		var both = [];
		var second = [];
		var swapArrays = false;

		if (arr1.length > arr2.length) {
			swapArrays = true;
			[arr1, arr2] = [arr2, arr1];
		}

		var dict = new Map();
		for (var item1 of arr1) dict.set(item1, 1);
		for (var item2 of arr2) {
			if (dict.has(item2)) {
				both.push(item2);
				dict.set(item2, 0);
			} else {
				second.push(item2);
			}
		}
		for (var itemDict of dict.keys()) {
			if (dict.get(itemDict) === 1) first.push(itemDict);
		}
		if (swapArrays) return {first: second, both, second: first};
		else return {first, both, second};
	}

	public static indexDiffOfKeyArray(arr1, arr2, keyString: string): any {
		var first = [];
		var both = [];
		var second = [];
		var mark = {};

		if (!arr1 || !arr1.length) {
			if (arr2 && arr2.length) {
				for (var i: number = 0; i < arr2.length; i++) {
					second.push({i1: -1, i2: i});
				}
			}
		} else if (!arr2 || !arr2.length) {
			for (var i: number = 0; i < arr1.length; i++) {
				first.push({i1: i, i2: -1});
			}
		} else {
			for (var i = 0; i < arr1.length; i++) {
				var i2: number;
				var key: any;
				if (arr1[i] === null || typeof arr1[i] !== "object") {
					i2 = -1;
				} else if (!arr1[i].hasOwnProperty(keyString)) {
					throw new Error(`To diff an array, every item should have key property ${keyString} defined.`);
				} else {
					key = arr1[i][keyString];
					i2 = _.findIndex(arr2, (obj) => {
						return obj[keyString] === key;
					});
				}
				if (i2 === -1) {
					//only in first
					first.push({i1: i, i2: -1});
				} else {
					// in both
					both.push({i1: i, i2});
					mark[key] = true;
				}
			}

			for (var i = 0; i < arr2.length; i++) {
				var key = arr2[i][keyString];
				if (!mark[key]) second.push({i1: -1, i2: i});
			}
		}
		return {first, both, second};
	}

	public static getArrayChildsTypes(arr: any[], keyString: string): ArrayChildType {
		for (var obj of arr) {
			if (obj === undefined || obj === null) continue;
			else if (typeof obj === "object") {
				if (obj.hasOwnProperty(keyString)) return ArrayChildType.COMPLEX_WITH_KEY;
				else return ArrayChildType.COMPLEX;
			} else return ArrayChildType.SIMPLE;
		}
		return ArrayChildType.UNKNOWN;
	}

	public static chunk(arr: any[], size: number) {
		var chunkedArr: any[] = [];
		var noOfChunks = Math.ceil(arr.length / size);
		for (var i = 0; i < noOfChunks; i++) {
			chunkedArr.push(arr.slice(i * size, (i + 1) * size));
		}
		return chunkedArr;
	}

	public static mode(someArray: any[]) {
		var modes: any[] = [];
		var counter: any = {};
		var i: string | number;
		var value: any;
		var maxIndex = 0;

		for (i = 0; i < someArray.length; i += 1) {
			value = someArray[i];
			counter[value] = (counter[value] || 0) + 1;
			if (counter[value] > maxIndex) {
				maxIndex = counter[value];
			}
		}

		for (i in counter) {
			if (counter.hasOwnProperty(i)) {
				if (counter[i] === maxIndex) {
					modes.push(i);
				}
			}
		}

		return modes;
	}

	public static sortNumbers(values: number[]): number[] {
		return values.sort((a: number, b: number) => a - b);
	}

	public static ksortNumbers(values: number[]): number[] {
		return values.sort((a: number, b: number) => b - a);
	}

	public static moveToIndex(sourceArray: any[], fromIndex: number, toIndex: number): any[] {
		if (toIndex >= sourceArray.length || fromIndex >= sourceArray.length) throw new Error("Index out of bounds");
		sourceArray.splice(toIndex, 0, sourceArray.splice(fromIndex, 1)[0]);
		return sourceArray;
	}

	public static moveToFront(sourceArray: any[], fromIndex: number): any[] {
		return ArrayUtil.moveToIndex(sourceArray, fromIndex, 0);
	}

	public static normalize(sourceArray: number[]) {
		let sum = sourceArray.reduce((acc: number, val: number) => {
			return acc + val;
		}, 0);
		return sourceArray.map((val: number) => val / sum);
	}

	public static haveUniqueValues(testArray: any[]): boolean {
		return !ArrayUtil.getDuplicates(testArray).length;
	}

	public static getDuplicates(testArray: any[]): any[] {
		let uniq = new Set<any>();
		let duplicates: any[] = [];
		for (let i = 0; i < testArray.length; i++) {
			let item = testArray[i];
			if (uniq.has(item)) duplicates.push(item);
			else uniq.add(item);
		}
		return duplicates;
	}

	public static concat(...arrays) {
		var result = [];
		arrays.forEach((array) => (result = result.concat(array)));
		return result;
	}

	public static random<T>(items: T[]): T {
		return items[Math.floor(Math.random() * items.length)];
	}
}

export enum ArrayChildType {
	SIMPLE,
	COMPLEX_WITH_KEY,
	COMPLEX,
	UNKNOWN,
}

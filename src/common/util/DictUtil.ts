/*
 * a
 */

/*
 * a
 */

import _ from "underscore";

export class DictUtil {
	public static getObjectLength(obj: any): number {
		var size = 0;
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	}

	public static forEachProperty(obj: any, handler: (value: any, key?: any, obj?: any) => void) {
		_.each(obj, handler);
	}
}

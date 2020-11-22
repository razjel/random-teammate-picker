import _ from "underscore";

/**
 * Created by Wojciech Adaszyński, w.adaszynski@getprintbox.com
 * Date: 14.07.16
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */

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

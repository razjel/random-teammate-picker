/*
 * a
 */

/*
 * a
 */

import {BindArray} from "../actionFlow/binding/BindArray";
import {BindUtil} from "../actionFlow/binding/BindUtil";
import {NumberUtil} from "./NumberUtil";

export class ObjectUtil {
	public static className(obj: any): string {
		if (obj === null || obj === undefined) return "null";
		else if (typeof obj === "object") {
			return obj.constructor.name;
		} else {
			return typeof obj;
		}
	}

	public static getClass(obj: any): any {
		return obj.constructor;
	}

	public static createNewInstance(obj: any): any {
		return new obj.constructor();
	}

	/** K: val type, V: last object index*/
	private static _UID: any = {};

	public static generateId(clazz: any = null): string {
		if (process.env.isDebug && clazz && !process.env.isNativeMobile && !process.env.isUnit) {
			var className: string = "";
			if (typeof clazz === "string") className = clazz;
			else {
				var classData = BindUtil.actionFlow.getClassDataByClass(clazz);
				if (classData) className = classData.typeName;
			}
			if (className) {
				var idx: number = ObjectUtil._UID[className] + 1 || 1;
				ObjectUtil._UID[className] = idx;
				return `${className}_${idx}`;
			}
		}

		return ObjectUtil.getRandomUUID();
	}

	public static getRandomUUID() {
		var d = new Date().getTime();
		var id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
		});
		return id;
	}

	public static isLongId(id: string): boolean {
		const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i;
		return uuidV4Regex.test(id);
	}

	public static isShortId(id: string | number): boolean {
		return NumberUtil.isNumeric(id);
	}

	public static clone<T>(data: T): T {
		let ctor = data.constructor as any;
		return Object.assign(new ctor(), data);
	}

	public static regenerateIds(objects: any[] | BindArray<any>): void {
		objects.forEach((obj: any) => {
			if (obj.hasOwnProperty("id")) obj.id = ObjectUtil.generateId(ObjectUtil.getClass(obj));
		});
	}

	public static JSONClone(obj: any): any {
		return JSON.parse(JSON.stringify(obj));
	}

	/** why not object.assign()? */
	public static extendIfNotDefined(toExtend: any, values: any): void {
		for (var key in values) if (toExtend[key] === undefined) toExtend[key] = values[key];
	}

	public static getBaseClassOfInstance(inst: any): any {
		return inst["__proto__"]["__proto__"].constructor;
	}

	public static getBaseClassOfClass(clazz: any): any {
		return clazz["__proto__"].constructor;
	}

	public static defaultOptions(customOptions: any, defaultOptions?: any): any {
		return Object.assign({}, defaultOptions, customOptions);
	}

	public static removeProps(target: any, predicate: (propName) => boolean): any {
		if (target === null || target === undefined) return target;
		for (var prop in target) {
			var propType: string = typeof target[prop];
			if (target[prop] === null || propType === "function") {
			} else if (predicate(prop)) {
				delete target[prop];
			} else if (propType === "object") {
				ObjectUtil.removeProps(target[prop], predicate);
			}
		}
		return target;
	}

	public static deepAssign(target: any, source: any): any {
		if (target === null || target === undefined || target === source) return target;
		for (const sourcePropName in source) {
			const sourcePropType: string = typeof source[sourcePropName];
			const targetPropType: string = typeof target[sourcePropName];
			if (source[sourcePropName] === null || sourcePropType === "function" || targetPropType === "function")
				continue;

			if (targetPropType === "object" && sourcePropType === "object") {
				ObjectUtil.deepAssign(target[sourcePropName], source[sourcePropName]);
			} else {
				target[sourcePropName] = source[sourcePropName];
			}
		}
		return target;
	}

	public static getCommonPropValue(objects: any[], propName: string, defaultValue: any): any {
		var props: string[] = propName.split(".");
		var arr: any[] = objects.concat();
		for (var i: number = 0; i < props.length; i++) {
			var prop = props[i];
			if (i == props.length - 1) {
				//last prop
				var value: any = arr[0][prop];
				for (var j: number = 0; j < arr.length; j++) {
					if (value !== arr[j][prop]) return defaultValue;
				}
				return value;
			} else {
				for (var j: number = 0; j < arr.length; j++) {
					arr[j] = arr[j][prop];
					if (!arr[j]) return defaultValue;
				}
			}
		}
		return defaultValue;
	}

	public static getUpProp(
		object: any,
		propName: string,
		options?: {
			parentPropName?: string;
			stopValue?: any;
			skipFalseValues?: boolean;
		}
	): any[] {
		options = ObjectUtil.defaultOptions(options, {
			parentPropName: "parentNode",
			stopValue: undefined,
			skipFalseValues: false,
		});

		var values: any[] = [];
		var value: any;
		while (object) {
			value = object[propName];
			if (!options.skipFalseValues || value) values.push(value);
			if (options.stopValue !== undefined && value === options.stopValue) break;
			object = object[options.parentPropName];
		}
		return values;
	}

	public static copyProps(
		fromObj: any,
		toObj: any,
		props: string[],
		replacer?: (prop: string, value: any) => any
	): any {
		props.forEach((prop: string) => {
			toObj[prop] = replacer ? replacer(prop, fromObj[prop]) : fromObj[prop];
		});
		return toObj;
	}

	public static nullifyAllProps(obj, options: {excludeString?: boolean} = {}) {
		for (var prop in obj) {
			if (options.excludeString && typeof obj[prop] === "string") continue;
			obj[prop] = null;
		}
	}

	public static isNullish(obj: any): boolean {
		return obj === null || obj === undefined;
	}
}

/*
 * a
 */

/*
 * a
 */
import {ObjectUtil} from "./ObjectUtil";

export class NumberUtil {
	public static moduloCap(num: number, max: number): number {
		var out = num % max;
		return out < 0 ? out + max : out;
	}

	public static cap(num: number, min: number, max: number): number {
		if (isNaN(num)) num = 1;
		if (num < min) num = min;
		if (num > max) num = max;
		return num;
	}

	public static wrap(num: number, min: number, max: number): number {
		if (isNaN(num)) num = min;

		if (num < min) num = max;

		if (num > max) num = min;

		return num;
	}

	public static round(value: number, places: number = 0): number {
		var n: number = Math.pow(10, places);
		return Math.round(value * n) / n;
	}

	public static isValidNumber(number): boolean {
		return typeof number === "number" && !isNaN(number) && Math.abs(number) !== Infinity;
	}

	public static getRandomInt(min, max): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	public static isBetween(value, min, max, options: {closedInterval?: boolean} = {}): boolean {
		if (options.closedInterval) return value >= min && value <= max;
		else return value > min && value < max;
	}

	public static formatFloats(value: any, precision: number = 2): number {
		return parseFloat(parseFloat(value).toFixed(precision));
	}

	public static generateIntSequence(from: number, to: number, {step = 1, ascending = true} = {}) {
		var tab = [];
		if (ascending) {
			for (; from <= to; from += step) tab.push(from);
		} else {
			for (; from >= to; from -= step) tab.push(from);
		}
		return tab;
	}

	public static isNumeric(testData: any): boolean {
		return /^-?\d+$/.test(testData);
	}

	public static areClose(a: number, b: number, tolerance: number): boolean {
		return Math.abs(a - b) <= tolerance;
	}

	public static getClosestToFromExistingSet(availableValues: number[], value: number): number {
		if (!availableValues.length) throw new Error("Provided set was empty");

		return NumberUtil.getClosestToFromSet(availableValues, value);
	}

	public static getClosestToFromPossibleEmptySet(availableValues: number[], value: number): number {
		if (!availableValues.length) return value;

		return NumberUtil.getClosestToFromSet(availableValues, value);
	}

	public static getClosestToFromSet(availableValues: number[], value: number): number {
		const sortedValues = availableValues.concat().sort((a, b) => a - b);
		const previousVal = sortedValues
			.concat()
			.reverse()
			.find((val) => value >= val);
		const nextVal = sortedValues.find((val) => value <= val);

		if (ObjectUtil.isNullish(previousVal)) return nextVal;
		if (ObjectUtil.isNullish(nextVal)) return previousVal;
		if (nextVal === previousVal) return previousVal;

		let diffToPrevious = value - previousVal;
		let diffToNext = nextVal - value;

		return diffToPrevious <= diffToNext ? previousVal : nextVal;
	}

	public static getPercentage(x: number, y: number): number {
		return ~~((x / y) * 100);
	}
}

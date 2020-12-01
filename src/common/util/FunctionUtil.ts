/*
 * a
 */

/*
 * a
 */

export class FunctionUtil {
	public static getParametersNames(fn: Function) {
		var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
		var code = fn.toString().replace(COMMENTS, "");
		var result = code.slice(code.indexOf("(") + 1, code.indexOf(")")).match(/([^\s,]+)/g);

		return result === null ? [] : result;
	}

	public static sleep(timeMs: number): Promise<any> {
		return new Promise<void>((resolve, reject) => {
			setTimeout(resolve, timeMs);
		});
	}

	public static async retryAsync(
		func: () => Promise<any>,
		maxAttempts: number,
		currentAttempt = 1,
		options: {
			sleepBeforeNextAttempt?: boolean;
			sleepAttemptIteratorMs?: number;
			onFailure?: (error: any) => void;
			abortNextAttemptsCondition?: (error: any) => boolean;
		}
	) {
		try {
			if (options && options.sleepAttemptIteratorMs && currentAttempt > 1) {
				let sleepTime = (options.sleepAttemptIteratorMs || 250) * (currentAttempt - 1);
				await FunctionUtil.sleep(sleepTime);
			}
			return await func();
		} catch (error) {
			let abortNextAttempts = options.abortNextAttemptsCondition && options.abortNextAttemptsCondition(error);
			if (maxAttempts <= currentAttempt || abortNextAttempts) {
				if (options && options.onFailure) {
					options.onFailure(error);
				} else {
					throw error;
				}
			} else {
				return await FunctionUtil.retryAsync(func, maxAttempts, currentAttempt + 1, options);
			}
		}
	}

	public static changeFunctionName(fn: any, newName: string) {
		Object.defineProperty(fn, "name", {
			writable: true,
		});
		fn.name = newName;
		Object.defineProperty(fn, "name", {
			writable: false,
		});
	}
}

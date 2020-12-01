/*
 * a
 */

/*
 * a
 */

export class PromiseUtil {
	public static promiseTimeout(promise: Promise<any>, ms: number) {
		const timeout = new Promise((resolve, reject) => {
			const id = setTimeout(() => {
				clearTimeout(id);
				reject({timeout: true, message: "Promise timed out in " + ms + "ms."});
			}, ms);
		});

		return Promise.race([promise, timeout]);
	}

	public static isPromise(object: any): boolean {
		return !!object && "then" in object;
	}
}

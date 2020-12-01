/*
 * a
 */

/*
 * a
 */

export function DisableObjectFreezeAndSeal() {
	(Object as any).freeze = function (obj) {
		return obj;
	};
	Object.isFrozen = function () {
		return true;
	};
	Object.isSealed = function () {
		return true;
	};
}

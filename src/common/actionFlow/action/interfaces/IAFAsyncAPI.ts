/*
 * a
 */

/*
 * a
 */

export interface IAFAsyncAPI {
	uid: string;

	terminate();

	endIfTerminated();

	callOnTerminate(callback: Function);

	wrapPromise(promise: Promise<any>): Promise<any>;

	isTerminated();

	//-------------------------------
	//  temporary
	//-------------------------------
	/** @deprecated */
	killAllExceptMe();
}

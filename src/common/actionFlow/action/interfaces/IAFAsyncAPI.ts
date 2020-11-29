/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2018-01-31
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
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

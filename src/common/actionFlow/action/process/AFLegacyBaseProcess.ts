/*
 * a
 */

/*
 * a
 */

import {afProcess} from "../decorators/AFActionDecorators";

/**
 * can be async or singular
 */
export class AFLegacyBaseProcess {
	/** namespace */
	public pbxLib = {
		singular: false,
		playbackBlocking: false,
		// mark processes which might stop to work when we change how process return Promise
		doesntUseAwait: false,

		_promise: null,
		_promiseResolve: null,
		_promiseReject: null,
	};

	protected _isCanceled: boolean = false;
	public get isCanceled(): boolean {
		return this._isCanceled;
	}

	protected _isTerminated: boolean = false;
	public get isTerminated(): boolean {
		return this._isTerminated || this._isCanceled;
	}

	//---------------------------------------------------------------
	//
	//      execute
	//
	//---------------------------------------------------------------

	/**
	 * This function is only to show how it should look like.
	 * Here it does nothing and it doesn't need decorator, but any process extending this must
	 * specify it and apply decorator to it.
	 * Options should be declared only in static function decorator
	 */
	@afProcess("LegacyBaseProcess", {})
	public static execute(...args) {
		throw new Error(
			"static execute function must be written in your process class " + "and must apply same decorator as here"
		);
	}

	/**
	 * This function is only to show how it should look like.
	 * Here it does nothing and it doesn't need decorator, but any process extending this must
	 * specify it and apply decorator to it.
	 */
	@afProcess("LegacyBaseProcess")
	public execute(...args) {
		throw new Error(
			"execute function must be overridden in your process class " +
				"and it can't call this base `execute()` function"
		);
	}

	//TODO razjel: change all usages to new ProcessClass
	public static newInst(clazz): AFLegacyBaseProcess {
		return new clazz() as AFLegacyBaseProcess;
	}

	//---------------------------------------------------------------
	//
	//      finish async
	//
	//---------------------------------------------------------------

	/**
	 * Only single argument can be returned from async/await call. If one need to pass more
	 * arguments she has to wrap it inside object or array.
	 * <code>
	 *     ...
	 *     Promise(function(resolve, reject) {
	 *     	...
	 *     	resolve(arg1, arg2, arg3); //only first argument will be returned in await
	 *     	...
	 *     }
	 *     ...
	 *     var result = await fn(); //result will be equal to arg1
	 * </code>
	 * @param asyncResult
	 */
	public finish = (asyncResult?: any): void => {
		this._end(asyncResult, this.pbxLib._promiseResolve);
	};

	public terminate = (): void => {
		this._isTerminated = true;
		this._end(null, this.pbxLib._promiseReject);
	};

	protected _end = (asyncResult: any, resultFunction: Function): void => {
		if (resultFunction) resultFunction(asyncResult);
		this.pbxLib._promise = null;
		this.pbxLib._promiseResolve = null;
		this.pbxLib._promiseReject = null;
	};

	//---------------------------------------------------------------
	//
	//      cancel
	//
	//---------------------------------------------------------------

	public cancel(): void {
		this._isCanceled = true;
	}
}

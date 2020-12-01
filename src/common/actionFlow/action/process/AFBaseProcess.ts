/*
 * a
 */

/*
 * a
 */
import {afProcess} from "../decorators/AFActionDecorators";
import {IAFAsyncAPI} from "../interfaces/IAFAsyncAPI";

/**
 * can be async or singular
 */
export class AFBaseProcess {
	public pbxLibLegacy = {
		playbackBlocking: false,
	};

	public asyncAPI: IAFAsyncAPI = null;

	/**
	 * This function is only to show how it should look like.
	 * Here it does nothing and it doesn't need decorator, but any process extending this must
	 * specify it and apply decorator to it.
	 */
	@afProcess("AFBaseProcess")
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
	@afProcess("AFBaseProcess")
	public execute(...args) {
		throw new Error(
			"execute function must be overridden in your process class " +
				"and it can't call this base `execute()` function"
		);
	}

	public terminate() {
		//-------------------------------
		//	check asyncAPI because in some sophisticated cases we can call method on terminated process (library)
		//-------------------------------
		if (this.asyncAPI) this.asyncAPI.terminate();
	}

	public endIfTerminated() {
		this.asyncAPI.endIfTerminated();
	}

	public callOnTerminate(callback: Function) {
		this.asyncAPI.callOnTerminate(callback);
	}

	public wrapPromise(promise: Promise<any>): Promise<any> {
		return this.asyncAPI.wrapPromise(promise);
	}

	/** @deprecated */
	public killAllExceptMe() {
		this.asyncAPI.killAllExceptMe();
	}
}

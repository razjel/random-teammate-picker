import {IAFAsyncAPI} from "../interfaces/IAFAsyncAPI";
import {IAFStaticAsyncActions} from "../interfaces/IAFStaticAsyncActions";
import {AFBaseProcess} from "../process/AFBaseProcess";
import {AFLegacyBaseProcess} from "../process/AFLegacyBaseProcess";

export class AFAsyncData {
	private static _scount: number = 1;
	public uid: string = "AFAsyncData_" + AFAsyncData._scount++;

	//-------------------------------
	//  action router data
	//-------------------------------
	public actionName: string;
	public actionArgs: any[];
	public processInstance: AFLegacyBaseProcess | AFBaseProcess;
	public actionConstructor: typeof AFLegacyBaseProcess | typeof AFBaseProcess | typeof IAFStaticAsyncActions;

	//-------------------------------
	//  async logic data
	//-------------------------------
	public playbackBlocking = false;

	public terminateCallback: Function;
	public isTerminated: boolean = false;
	public isRejected: boolean = false;

	public api: IAFAsyncAPI = {} as IAFAsyncAPI;

	//-------------------------------
	//  new data
	//-------------------------------
	public parentUID: string;
	public childUID: string;
	public wrapReject: Function;
	public promise: Promise<any>;
	public terminateWasCalledSynchronously: boolean;
	//TODO razjel: hide it somehow or save it somewhere else
	public rejectReason: any;

	//-------------------------------
	//  debug
	//-------------------------------
	public toString() {
		return `uid='${this.uid}', actionName='${this.actionName}'`;
	}
}

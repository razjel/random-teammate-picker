/*
 * a
 */

/*
 * a
 */

import {DisableObjectFreezeAndSeal} from "../polyfill/ObjectFreezePolyfill";
import {AFActionRouter} from "./action/router/AFActionRouter";
import {AFActionTreeLogging} from "./action/router/AFActionTreeLogging";
import {BrowserFrameManager} from "./BrowserFrameManager";
import {ActionTree} from "./debug/actionTree/ActionTree";
import {ViewValidator} from "./validation/ViewValidator";

export function ActionFlowInit({startBrowserFrameManager}) {
	DisableObjectFreezeAndSeal();
	AFActionTreeLogging.actionTree = new ActionTree();
	ViewValidator.init();
	if (startBrowserFrameManager) {
		BrowserFrameManager.init();
	}
}

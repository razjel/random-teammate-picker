import {afAction} from "./action/decorators/AFActionDecorators";

export class BrowserFrameManager {
	public static init(): void {
		//if (!process.env.isUnit) {
		BrowserFrameManager.nextFrame();
		//}
	}

	@afAction("BrowserFrameManager.nextFrame")
	public static nextFrame(skipRequest = false): void {
		if (!skipRequest) window.requestAnimationFrame(BrowserFrameManager._nextFrame);
	}

	private static _nextFrame(): void {
		BrowserFrameManager.nextFrame();
	}
}

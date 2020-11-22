/**
 * Created by Michal Czaicki, m.czaicki@getprintbox.com
 * Date: 2015-10-06
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
export class IConnectedView {
	public pbxLib: {
		__invalidate: () => any;
	};

	public invalidate(): void {}

	public validate(): void {}

	public dispose(): void {}
}

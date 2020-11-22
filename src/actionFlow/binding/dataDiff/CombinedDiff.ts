/**
 * Copyright (c) 2018-present, Printbox www.getprintbox.com
 * All rights reserved.
 */
export class CombinedDiff {
	public oldVal: any;
	public newVal: any;

	constructor(oldVal: any, newVal: any) {
		this.oldVal = oldVal;
		this.newVal = newVal;
	}
}

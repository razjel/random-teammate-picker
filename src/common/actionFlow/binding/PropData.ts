/**
 * Created by Michal Czaicki, m.czaicki@getprintbox.com
 * Date: 2015-11-20
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
export class PropData {
	public key: string = "";
	public serializedName: string;
	public bindable: boolean = false;
	public serializable: boolean = false;

	public debugWatch: boolean = false;

	constructor(key: string, bindable: boolean, serializable: boolean, serializedName?: string) {
		this.key = key;
		this.bindable = bindable;
		this.serializable = serializable;
		this.serializedName = serializedName ? serializedName : key;
	}
}

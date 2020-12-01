/*
 * a
 */

/*
 * a
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

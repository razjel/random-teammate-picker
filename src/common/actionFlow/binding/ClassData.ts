/*
 * a
 */

/*
 * a
 */

import {PropData} from "./PropData";

export class ClassData {
	public initialized: boolean = false;
	public properties: PropData[] = [];
	public clazz: any = null;
	public typeName: string = "";

	constructor(clazz: any, typeName?: string) {
		this.clazz = clazz;
		this.typeName = typeName;
		this.properties.push(new PropData("__type", false, true));
	}
}

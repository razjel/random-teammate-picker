/*
 * a
 */

/*
 * a
 */

import _ from "underscore";
import {ObjectUtil} from "../../util/ObjectUtil";
import {BindInitOptions} from "./BindInitOptions";
import {BindUtil} from "./BindUtil";

interface ClassDefinition {
	clazz: typeof AFDataObject;
	name: string;
}

export class AFDataObject {
	public binds?: this;
	public deepBinds?: this;
	public dispose?: Function;
	public __type?: string;

	public __initBind?(className: string, clazz: any, options: BindInitOptions = {isContextRoot: false}): void {
		if (process.env.isUnit) {
			var classDef = _.findWhere(AFDataObject._classes, {name: className});
			if (classDef) {
				if (clazz != classDef.clazz) {
					className += "__" + ObjectUtil.generateId();
					AFDataObject._classes.push({clazz, name: className});
				}
			} else {
				AFDataObject._classes.push({clazz, name: className});
			}
		}

		BindUtil.init(this, className, clazz, options);
	}

	/**
	 * wipes nonserializable fields
	 * @returns {any}
	 */
	public cloneAF?(): this {
		return BindUtil.deserialize(JSON.stringify(this));
	}

	private static _classes: ClassDefinition[] = [];
}

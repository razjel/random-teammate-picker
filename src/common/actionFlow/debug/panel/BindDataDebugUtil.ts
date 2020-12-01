/*
 * a
 */

/*
 * a
 */

import {BindData} from "../../binding/BindData";
import {ArrayBindData} from "../../binding/ArrayBindData";
import {BindArray} from "../../binding/BindArray";

export class BindDataDebugUtil {
	public static logBindDatas(obj: any): void {
		var bd: BindData = obj.binds.binds;
		console.debug("BindDataDebugUtiBindDatas", BindDataDebugUtil._logBD(bd));
	}

	private static _logBD(bd: BindData, lineSign: string = "", propName: string = ""): string {
		var s: string = "";
		var name = bd.constructor["name"];
		s += `${lineSign} ${propName} ${name} ${bd.uid.toString()}\n`;

		var valName: string;
		if (bd.value === false) valName = "false";
		else if (bd.value === undefined || bd.value === null) valName = "undefined";
		else if (typeof bd.value === "object") valName = bd.value.constructor.name;
		else if (bd.value) valName = bd.value.toString();
		s += `${lineSign}- value: ${valName}\n`;

		var views = bd.getViews(true);
		s += `${lineSign}- deep views: ${views.length}\n`;
		views.forEach((view: any) => {
			s += `${lineSign}-  ${view.constructor.name} ${bd.uid.toString()}\n`;
		});

		var views = bd.getViews(false);
		s += `${lineSign}- shallow views: ${views.length}\n`;
		views.forEach((view: any) => {
			s += `${lineSign}-  ${view.constructor.name} ${bd.uid.toString()}\n`;
		});

		if (bd instanceof ArrayBindData) {
			var bdArr: ArrayBindData = bd as ArrayBindData;
			s += `${lineSign}- array values: ${bdArr.value.length}\n`;
			var arr = bdArr.value as BindArray<any>;
			var len: number = arr.length;
			for (var i: number = 0; i < len; i++) {
				var childBD: BindData = bdArr.get(i);
				var s2 = BindDataDebugUtil._logBD(childBD, lineSign + "-", i.toString());
				s += s2;
			}
		} else {
			var props: any = bd.propMap;
			var propsCount: number = 0;
			var sTmp = "";
			for (var key in props) {
				if (key === "binds" || key === "dispose") continue;
				propsCount++;
				var childBD: BindData = props[key];
				var s2 = BindDataDebugUtil._logBD(childBD, lineSign + "-", key);
				sTmp += s2;
			}
			s += `${lineSign}- props: ${propsCount}\n`;
			s += sTmp;
		}
		return s;
	}
}

/*
 * a
 */

/*
 * a
 */

import _ from "underscore";
import {ArrayChildType, ArrayUtil} from "../../util/ArrayUtil";
import {ObjectUtil} from "../../util/ObjectUtil";
import {ViewValidator} from "../validation/ViewValidator";
import {AFDataObject} from "./AFDataObject";
import {ArrayBindData} from "./ArrayBindData";
import {BindArray} from "./BindArray";
import {BindContext} from "./BindContext";
import {BindData} from "./BindData";
import {BindExpression} from "./BindExpression";
import {BindInitOptions} from "./BindInitOptions";
import {ClassData} from "./ClassData";
import {DeepBind} from "./DeepBind";
import {PropData} from "./PropData";

export class BindUtil {
	public static PROP_INIT_AFTER_DESERIALIZE: string = "__initAfterDeserialization";

	//-------------------------------
	//  data
	//-------------------------------
	/** K:className, V:ClassData */
	private static _sClasses: any = {};

	/** K:class constructor, V:ClassData */
	private static _sTempDecoratorClasses = new Map<any, ClassData>();

	protected static _bindabilityDisabled = false;
	private static _currentPropForErrorLog;

	//---------------------------------------------------------------
	//
	//      decorators
	//
	//---------------------------------------------------------------
	public static nonBindable(target: any, key: string): void {
		let propData = BindUtil.getOrCreatePropData(target, key);
		propData.bindable = false;
		BindUtil._defineClassProperty(target, propData);
	}

	public static nonSerializable(target: any, key: string): void {
		let propData = BindUtil.getOrCreatePropData(target, key);
		propData.serializable = false;
		BindUtil._defineClassProperty(target, propData);
	}

	public static nonSerializableAndBindable(target: any, key: string): void {
		let propData = BindUtil.getOrCreatePropData(target, key);
		propData.serializable = false;
		propData.bindable = false;
		BindUtil._defineClassProperty(target, propData);
	}

	public static debugWatch(target: any, key: string): void {
		let propData = BindUtil.getOrCreatePropData(target, key);
		propData.debugWatch = true;
		BindUtil._defineClassProperty(target, propData);
	}

	public static serializedName(name: string): any {
		return function (target, key) {
			let propData = BindUtil.getOrCreatePropData(target, key);
			propData.serializedName = name;
			BindUtil._defineClassProperty(target, propData);
		};
	}

	private static getOrCreatePropData(target, key): PropData {
		let classData: ClassData = BindUtil._sTempDecoratorClasses.get(target.constructor);
		let propData: PropData;
		if (classData) propData = _.findWhere(classData.properties, {key: key});
		if (!propData) propData = new PropData(key, true, true);
		return propData;
	}

	private static _defineClassProperty(instance: any, prop: PropData): void {
		// var className:string = ObjectUtil.className(instance);

		var classData: ClassData = BindUtil._sTempDecoratorClasses.get(instance.constructor);
		if (!classData) {
			classData = new ClassData(instance.constructor);
			BindUtil._sTempDecoratorClasses.set(instance.constructor, classData);
		}
		classData.properties.push(prop);
	}

	//---------------------------------------------------------------
	//
	//      object procesing
	//
	//---------------------------------------------------------------

	//-------------------------------
	//  object initialization
	//-------------------------------
	public static registerClass(clazz: any): void {
		new clazz();
	}

	public static init(
		inst: any,
		className: string,
		clazz: any,
		options: BindInitOptions = {isContextRoot: false}
	): void {
		var isSubClass = clazz !== ObjectUtil.getClass(inst);
		if (isSubClass) {
			BindUtil.ifSubClassIsntRegisteredCreateInstanceToInitIt(className, clazz);
			return;
		}

		BindUtil._initInstance(inst, className, null, options.isContextRoot);

		var keys: PropData[] = BindUtil._getObjectKeys(inst, className, clazz);
		var props: any = {};
		for (var i: number = 0; i < keys.length; i++) {
			var propData = keys[i];
			if (BindUtil._bindabilityDisabled) propData.bindable = false;
			if (propData.bindable)
				props[propData.key] = BindUtil.getBindablePropDesc(inst, propData.key, propData.serializable, {
					debugWatch: propData.debugWatch,
				});
			else if (!propData.serializable && !propData.bindable)
				props[propData.key] = BindUtil.getNonSerializableNonBindableDesc(inst, propData.key);
		}
		Object.defineProperties(inst, props);
	}

	private static ifSubClassIsntRegisteredCreateInstanceToInitIt(className: string, clazz: any) {
		if (!BindUtil._sClasses[className]) {
			new clazz();
		}
	}

	//-------------------------------
	//  instance
	//-------------------------------
	private static _initInstance(
		inst: any,
		className: string,
		instBindData: BindData = null,
		isContextRoot: boolean = false
	): string {
		var objectWasInitedAs = inst.__type;
		if (!objectWasInitedAs) {
			if (!instBindData) instBindData = new BindData();
			if (isContextRoot) instBindData.context = new BindContext();

			Object.defineProperty(instBindData.propMap, "binds", {
				enumerable: false,
				configurable: true,
				writable: false,
				value: instBindData,
			});
			Object.defineProperty(instBindData.deepBindsPropMap, "deepBinds", {
				enumerable: false,
				configurable: true,
				writable: false,
				value: new DeepBind(instBindData),
			});

			instBindData.value = inst;
			if (process.env.isDebug) {
				instBindData.debug_className = className;
			}

			BindUtil._defineBindableObjectProperties(inst, instBindData.propMap, instBindData.deepBindsPropMap);
		}

		inst.__type = className;
		return objectWasInitedAs;
	}

	private static _defineBindableObjectProperties(inst: any, bindsValue: any, deepBindsValue: any): void {
		Object.defineProperties(inst, {
			binds: {enumerable: false, configurable: true, writable: false, value: bindsValue},
			deepBinds: {
				enumerable: false,
				configurable: true,
				writable: false,
				value: deepBindsValue,
			},
			dispose: {
				enumerable: false,
				configurable: true,
				writable: false,
				value: BindUtil.dispose.bind(BindUtil, inst),
			},
		});
	}

	//-------------------------------
	//  properties
	//-------------------------------

	private static getBindablePropDesc(
		inst: AFDataObject,
		key: string,
		enumerable: boolean,
		{debugWatch = false} = {}
	): PropertyDescriptor {
		var val = inst[key];
		if (typeof val === "function") return;

		var instBindData: BindData = inst.binds.binds as any;
		var bindData: BindData;
		if (val && val.hasOwnProperty("binds")) {
			bindData = val.binds.binds;
		} else {
			bindData = new BindData();
			bindData.value = val;
		}
		if (process.env.isDebug) {
			bindData.debug_propName = key;
		}
		bindData.addParent(instBindData);
		inst.binds[key] = bindData;
		inst.deepBinds[key] = bindData.deepBind;

		var desc: PropertyDescriptor = {
			configurable: true,
			enumerable: enumerable,
			get: function () {
				return bindData.value;
			},

			//-------------------------------
			//  setter
			//-------------------------------
			set: function (value) {
				var oldVal: any = bindData ? bindData.value : null;
				if (value === oldVal) return;

				var captureMode = instBindData.context && instBindData.context.captureMode;
				var capturedVal: any;
				var capturedValDefined: boolean;
				var newBindData: BindData;

				if (captureMode && bindData.oldValueIsSet) {
					capturedVal = bindData.oldValue;
					capturedValDefined = true;
				}

				if (oldVal && oldVal.hasOwnProperty("binds") && (value === null || value === undefined)) {
					var bdClazz = <any>bindData.constructor;
					newBindData = new bdClazz();
				}

				if (value) {
					if (value.hasOwnProperty("binds")) newBindData = value.binds.binds;
					else {
						newBindData = bindData;
						//if (process.env.isDebug && typeof value == "object")
						//	throw new Error(`you have set a non bindable value ${value} to bindable one ` +
						// `${this}`)
					}
				}
				if (!value && !newBindData) {
					newBindData = bindData;
				}

				if (newBindData !== bindData) {
					inst.binds[key] = newBindData;
					inst.deepBinds[key] = newBindData.deepBind;
					bindData.removeParent(instBindData);
					newBindData.addParent(instBindData);
				}

				if (bindData) {
					if (captureMode && (capturedValDefined || !newBindData.oldValueIsSet)) {
						if (capturedValDefined) newBindData.oldValue = capturedVal;
						else if (!newBindData.oldValueIsSet) {
							newBindData.oldValue =
								oldVal && oldVal.__type === "BindArray" ? (oldVal as BindArray<any>).toArray() : oldVal;
						}

						newBindData.oldValueIsSet = true;
						if (bindData !== newBindData) BindUtil.clearOldValues(bindData);
					}
					newBindData.value = value;
					newBindData.changed = true;
					bindData = newBindData;
				}

				if (debugWatch) {
					console.log(
						`[AF prop watcher] ${key} changed to: ${value}, from: ${oldVal}\nstack: ${"missing Tracer"}`
					);
				}
			},
		};
		return desc;
	}

	private static getNonSerializableNonBindableDesc(inst: AFDataObject, key: string): PropertyDescriptor {
		var descriptor: PropertyDescriptor = {};
		descriptor.configurable = true;
		descriptor.enumerable = false;
		descriptor.writable = true;
		descriptor.value = inst[key];
		return descriptor;
	}

	private static _getObjectKeys(inst: any, className: string, clazz: any): PropData[] {
		var classData = BindUtil._getOrCreateClassData(inst, className);

		if (process.env.isDebug && classData.clazz != clazz) {
			throw new Error(`You are trying to register two classes under the same name: "${className}"`);
		}

		if (!classData.initialized) this._initClassData(classData, inst);
		return classData.properties;
	}

	private static _getOrCreateClassData(instance: any, className?: string): ClassData {
		if (!className) className = ObjectUtil.className(instance);

		var classData: ClassData = BindUtil._sClasses[className];
		if (!classData) {
			let clazz: any = instance.constructor;
			classData = BindUtil._sTempDecoratorClasses.get(clazz);
			if (classData) {
				classData.typeName = className;
				BindUtil._sTempDecoratorClasses.delete(clazz);
			} else classData = new ClassData(clazz, className);
			clazz.__type = className;
			BindUtil._sClasses[className] = classData;
		}
		return classData;
	}

	private static _initClassData(classData: ClassData, inst: any) {
		var baseClass: any = ObjectUtil.getBaseClassOfInstance(inst);
		if (baseClass !== AFDataObject) {
			if (!baseClass.__type) BindUtil.registerClass(baseClass);
			let baseClassData: ClassData = BindUtil._sClasses[baseClass.__type];
			if (!baseClassData || !baseClassData.initialized) BindUtil.registerClass(baseClass);
			baseClassData = BindUtil._sClasses[baseClass.__type];
			classData.properties.push(...baseClassData.properties.slice(1));
		}

		for (var key in inst) {
			if (!_.findWhere(classData.properties, {key})) classData.properties.push(new PropData(key, true, true));
		}
		classData.initialized = true;
	}

	//-------------------------------
	//  array
	//-------------------------------

	public static makeArrayBindable(inst: BindArray<any>, className?: string, isContextRoot: boolean = false): void {
		var realBindData = new ArrayBindData();
		realBindData.value = inst;
		BindUtil._initInstance(inst, className, realBindData, isContextRoot);
	}

	//-------------------------------
	//  Serialization
	//-------------------------------
	public static serialize(inst: any): string {
		if (inst instanceof AFDataObject) {
			return JSON.stringify(BindUtil.serializeActionFlowDataObject(inst));
		} else {
			return JSON.stringify(inst);
		}
	}

	public static serializeActionFlowDataObject(inst): any {
		let clonedInst = ObjectUtil.clone(inst);
		let className: string = clonedInst.__type;
		let classData: ClassData = BindUtil._sClasses[className];
		for (let i: number = 0; i < classData.properties.length; i++) {
			let prop: PropData = classData.properties[i];
			if (!prop.serializable) {
				delete clonedInst[prop.key];
				continue;
			}

			let val = clonedInst[prop.key];
			delete clonedInst[prop.key];

			if (val && val.hasOwnProperty("__type")) {
				if (val instanceof BindArray) {
					clonedInst[prop.serializedName] = val.toArray();
				} else {
					clonedInst[prop.serializedName] = BindUtil.serializeActionFlowDataObject(val);
				}
			} else {
				clonedInst[prop.serializedName] = val;
			}
		}
		return clonedInst;
	}

	//---------------------------------------------------------------
	//
	//      deserialization
	//
	//---------------------------------------------------------------
	public static deserialize(json: string, toObj?: any): any {
		if (process.env.isDebug) {
			if (typeof json !== "string") throw new Error(`We can deserialize only strings`);
		}
		var inst = JSON.parse(json);
		if (inst) inst = BindUtil.initDeserializedObject(inst, toObj);
		return inst;
	}

	public static initDeserializedObject(plainInst: any, toObj?: any): any {
		try {
			return BindUtil._initDeserializedObjectLogic(plainInst, toObj);
		} catch (error) {
			// let modifiedError = ErrorModifyUtil.modifyError(error, {
			// 	messagePostfix: " - error with prop: " + BindUtil._currentPropForErrorLog,
			// });
			// throw modifiedError;
			throw error;
		}
	}

	private static _initDeserializedObjectLogic(plainInst: any, toObj?: any, propForErrorLog: string = ""): any {
		if (plainInst instanceof AFDataObject) throw new Error("plainInst already deserialised");

		BindUtil._currentPropForErrorLog = propForErrorLog;
		let inst: any;
		if (plainInst === null || plainInst === undefined || typeof plainInst !== "object") return plainInst;
		else if (Array.isArray(plainInst)) {
			inst = toObj ? toObj : new BindArray<any>();
			this.desArr(inst, plainInst, propForErrorLog);
		} else if (plainInst.hasOwnProperty("__type")) {
			var className: string = plainInst.__type;
			var classData: ClassData = BindUtil._sClasses[className];

			if (!classData) {
				var errorMsg = `Class ${className} was not registered and cannot be deserialized`;
				throw new Error(errorMsg);
			}

			inst = toObj ? toObj : new classData.clazz();
			this.desObj(inst, plainInst, classData, propForErrorLog);
			if (classData.clazz[BindUtil.PROP_INIT_AFTER_DESERIALIZE]) {
				classData.clazz[BindUtil.PROP_INIT_AFTER_DESERIALIZE](inst);
			}
		} else {
			return plainInst;
		}
		return inst;
	}

	private static desArr(inst: any, plainInst: any, propName: string = ""): void {
		var arr: BindArray<any> = inst;

		var plainArr: any[] = plainInst;
		var actualArr: any[] = arr.toArray();
		let plainArrChildType = ArrayUtil.getArrayChildsTypes(plainArr, arr.keyString);
		let actualArrayChildsType = ArrayUtil.getArrayChildsTypes(actualArr, arr.keyString);
		if (
			plainArrChildType === ArrayChildType.COMPLEX_WITH_KEY ||
			actualArrayChildsType === ArrayChildType.COMPLEX_WITH_KEY
		) {
			var {both, second} = ArrayUtil.indexDiffOfKeyArray(actualArr, plainArr, arr.keyString);

			var indexes: any[] = both.concat(second);
			indexes = _.sortBy(indexes, "i2");

			arr.length = 0;
			for (var i: number = 0; i < indexes.length; i++) {
				var actualIdx = indexes[i].i1;
				var plainIdx = indexes[i].i2;
				var newItem: any = BindUtil._initDeserializedObjectLogic(
					plainArr[plainIdx],
					actualIdx !== -1 ? actualArr[actualIdx] : null,
					BindUtil._getArrPropName(propName, plainIdx)
				);
				arr.set(plainIdx, newItem);
			}
		} else if (plainArrChildType === ArrayChildType.COMPLEX || actualArrayChildsType === ArrayChildType.COMPLEX) {
			arr.length = 0;
			plainArr.forEach((plainObj, idx) => {
				var newItem: any = BindUtil._initDeserializedObjectLogic(
					plainObj,
					null,
					BindUtil._getArrPropName(propName, idx)
				);
				arr.set(idx, newItem);
			});
		} else {
			arr.length = 0;
			if (plainArr) arr.push(...plainArr);
		}
	}

	private static desObj(inst: any, plainInst: any, classData: ClassData, propName: string = "") {
		for (var i: number = 0; i < classData.properties.length; i++) {
			var prop: PropData = classData.properties[i];
			if (!prop.serializable) continue;
			var val = plainInst[prop.serializedName];
			if ((val && val.hasOwnProperty("__type")) || Array.isArray(val)) {
				inst[prop.key] = BindUtil._initDeserializedObjectLogic(
					val,
					inst[prop.key],
					BindUtil._getObjPropName(propName, prop.key)
				);
			} else {
				inst[prop.key] = val;
			}
		}
	}

	private static _getArrPropName(prop, index) {
		return prop ? `${prop}[${index}]` : `object[${index}]`;
	}

	private static _getObjPropName(fullProp, prop) {
		return fullProp ? `${fullProp}.${prop}` : `object.${prop}`;
	}

	//---------------------------------------------------------------
	//
	//      object operations
	//
	//---------------------------------------------------------------
	public static extendDuplicateAFData<T = any>(target: T, source: any): T {
		for (var prop in source) {
			var value = source[prop];
			if (value instanceof AFDataObject) value = value.cloneAF();
			target[prop] = value;
		}
		return target;
	}

	public static dispose(item: any) {
		if (!item) return;
		if (!item.binds.binds) throw new Error("you should dispose bindable complex object");
		BindUtil._dispose(item.binds.binds, true);
	}

	private static _dispose(itemBD: BindData, removeFromParents: boolean = false) {
		if (removeFromParents) BindUtil._removeFromParents(itemBD);

		if (itemBD instanceof ArrayBindData) {
			(itemBD as ArrayBindData).value.forEach((item) => {
				if (item.hasOwnProperty("binds")) BindUtil._dispose(item.binds.binds);
			});
		}
		itemBD.actionFlow.nullify();
		ViewValidator.removeBindData(itemBD);

		for (var key in itemBD.propMap) {
			var childBD: BindData = itemBD.propMap[key];
			if (childBD) BindUtil._dispose(childBD);
		}
	}

	private static _removeFromParents(itemBD: BindData) {
		for (var parent of itemBD.actionFlow.getParents()) {
			if (parent instanceof ArrayBindData) {
				(parent as ArrayBindData).value.remove(itemBD.value); //it will remove array from
				// item parents
			} else {
				for (var key in (parent as BindData).propMap) {
					if ((parent as BindData).propMap[key] === itemBD) {
						(parent as BindData).value[key] = null; //it will run setter creating new
						// binddata
						break;
					}
				}
			}
		}
	}

	//---------------------------------------------------------------
	//
	//      expressions
	//
	//---------------------------------------------------------------
	public static expr(func: Function): any {
		return new BindExpression(func);
	}

	//---------------------------------------------------------------
	//
	//      external helpers
	//
	//---------------------------------------------------------------
	public static getClassData(instance: AFDataObject): ClassData {
		if (instance && instance.hasOwnProperty("__type")) return BindUtil._sClasses[instance.__type];
		return null;
	}

	public static getClassPropData(instance: AFDataObject, propName: string): PropData {
		var classData: ClassData = BindUtil._sClasses[instance.__type];
		if (!classData) return null;
		return _.findWhere(classData.properties, {key: propName});
	}

	public static invalidate(data: AFDataObject): void {
		BindUtil.getBindData(data).changed = true;
	}

	public static invalidateProps(data: AFDataObject, properties?: string[]): void {
		if (!data || !data.binds) return;
		for (var prop of properties) {
			let bindData = data.binds[prop] as BindData;
			bindData.changed = true;
			var captureMode = bindData.context && bindData.context.captureMode;
			if (captureMode && !bindData.oldValueIsSet) {
				var val = bindData.value;
				if (val && val.__type === "BindArray") val = (val as BindArray<any>).toArray();
				bindData.oldValue = val;
				bindData.oldValueIsSet = true;
			}
		}
	}

	public static getBindData(data: AFDataObject, propName?: string): BindData {
		if (!data || !data.hasOwnProperty("binds")) return null;
		return propName ? <any>data.binds[propName] : <any>data.binds.binds;
	}

	public static isBindInitialized(data: any): boolean {
		return BindUtil.getBindData(data) !== null;
	}

	public static getValueFromConnectedComponentBindProperty(val: any): any {
		var newBindData: BindData = null;
		if (val) {
			if (val instanceof BindData) newBindData = val;
			else if (val.binds instanceof BindData) newBindData = val.binds;
			else if (val instanceof DeepBind) newBindData = (val as DeepBind).bindData;
			else if (val.deepBinds instanceof DeepBind) newBindData = (val.deepBinds as DeepBind).bindData;

			if (newBindData) {
				return newBindData.value;
			} else if (val instanceof BindExpression) {
				var newExpression = val as BindExpression;
				return newExpression.getValue();
			}
		}
		return val;
	}

	//---------------------------------------------------------------
	//
	//      clear cached previous values
	//
	//---------------------------------------------------------------
	public static clearOldValues(objOrBindData: any | BindData): void {
		if (!objOrBindData) return;
		var bd: BindData;
		var instance: any;
		if (objOrBindData instanceof BindData) {
			bd = objOrBindData;
			instance = bd.value;
		} else {
			instance = objOrBindData as any;
			bd = BindUtil.getBindData(instance);
		}

		if (instance instanceof BindArray) {
			BindUtil._clearOldDataArray(instance as BindArray<any>);
		} else if (typeof objOrBindData === "object") {
			BindUtil._clearOldDataObject(instance);
		}
		if (bd) {
			bd.oldValue = null;
			bd.oldValueIsSet = false;
		}
	}

	private static _clearOldDataObject(obj: AFDataObject): void {
		if (!obj) return;
		var props = BindUtil.getClassData(obj).properties;
		for (var prop of props) {
			if (!prop.serializable || prop.key == "__type") continue;
			var val: any = obj[prop.key];
			var childBD: BindData = obj.binds[prop.key];
			if (childBD.childsChanged) {
				if (childBD instanceof ArrayBindData) {
					BindUtil._clearOldDataArray(val as BindArray<any>);
				} else if (typeof val === "object") {
					BindUtil._clearOldDataObject(val);
				}
			}
			childBD.oldValue = null;
			childBD.oldValueIsSet = false;
		}
	}

	private static _clearOldDataArray(arr: BindArray<any>): any {
		if (!arr) return;
		arr.forEach(BindUtil.clearOldValues);
	}

	//---------------------------------------------------------------
	//
	//      optimizations
	//
	//---------------------------------------------------------------
	/**
	 * Used by jsMigrator to speed up JSON.stringify process because node doesn't handle it well :S, where browser
	 * takes 120ms, node takes 8m30s
	 */
	public static disableBindability() {
		BindUtil._bindabilityDisabled = true;
	}

	public static isBindingDisabled(): boolean {
		return BindUtil._bindabilityDisabled;
	}

	//---------------------------------------------------------------
	//
	//      actionFlow
	//
	//---------------------------------------------------------------
	public static actionFlow = {
		cleanClasses: () => {
			return (BindUtil._sClasses = {});
		},
		getClassDataByClass: (clazz: any): ClassData => {
			return _.findWhere(BindUtil._sClasses, {clazz}) as any;
		},
	};
}

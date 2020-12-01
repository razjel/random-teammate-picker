/*
 * a
 */

/*
 * a
 */

import * as React from "react";

export interface BaseProps extends React.Props<React.ReactNode> {
	/**
	 * names of functions references of actions and which should invalidate the component
	 */
	actions?: any[];

	/**
	 * names of properties which should be shallow bound
	 */
	deepBinds?: string[];

	/**
	 * class name which should be attached to default component root div css class name
	 */
	className?: string;

	/**
	 * style object which will be applied to root html element
	 * change in this object will not cause connected component to rerender itself
	 */
	style?: any;

	/**
	 * for selenium testing attr data-sid
	 */
	data_sid?: string;

	/**
	 * adds ability for component consumer to force invalidation,
	 * if you need to use it, probably there is problem somewhere else
	 */
	dummyProps?: any;
	dummyProps2?: any;

	/**
	 *  if true component in connectedMode will render when parents render
	 */
	allowParentRender?: boolean;
}

export class PropsExcludedFromProcessing {
	public static props: string[] = ["actions", "deepBinds", "allowParentRender", "data_sid", "data-sid"];
}

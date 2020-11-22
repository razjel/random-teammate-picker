/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-22
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */

import React from "react";
import {DatabasePath} from "./DatabasePath";
import {Md} from "./Md";

export class RootView extends React.Component<any, any> {
	public users: any;
	public historyData: any;

	public async componentDidMount() {
		this.users = await Md.db.query(DatabasePath.users);
		this.historyData = await Md.db.query(DatabasePath.historyTeamRand);
		this.forceUpdate();
	}

	public render() {
		return (
			<div>
				hello
				{JSON.stringify(this.users, null, 2)}
				{JSON.stringify(this.historyData, null, 2)}
			</div>
		);
	}
}

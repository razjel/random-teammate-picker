/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-22
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */

import React from "react";
import {BindUtil} from "./actionFlow/binding/BindUtil";
import {ConnectedComponent} from "./actionFlow/components/ConnectedComponent";
import {DatabasePath} from "./DatabasePath";
import {Md} from "./Md";
import {User} from "./User";

export class RootView extends ConnectedComponent<any, any> {
	public users: any;
	public historyData: any;

	protected _onNewProps() {
		super._onNewProps();
		this.cleanInvalidatingProperties();
		this.addInvalidatingProperty(Md.users.all, false);
	}

	public async componentDidMount() {
		this.users = await Md.db.query(DatabasePath.users);
		this.historyData = await Md.db.query(DatabasePath.historyTeamRand);

		for (const userId in this.users) {
			Md.users.all.push(new User(userId, this.users[userId]));
		}
	}

	public render() {
		return (
			<div>
				hello
				{JSON.stringify(Md.users.all, null, 2)}
			</div>
		);
	}
}

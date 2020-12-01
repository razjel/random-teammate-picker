/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-22
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */

import React from "react";
import {ConnectedComponent} from "./common/actionFlow/components/ConnectedComponent";
import {Md} from "./globalModel/Md";
import {RandomizeActions} from "./randomize/RandomizeActions";
import {UserFrequencyChart} from "./statistics/userFrequency/UserFrequencyChart";
import {AddUserView} from "./user/AddUserView";
import {RemoveableUserListView} from "./user/RemoveableUserListView";
import {UserListView} from "./user/UserListView";

export class RootView extends ConnectedComponent<any, any> {
	public render() {
		return (
			<div>
				<div>
					<button onClick={RandomizeActions.randomize}>randomize</button>
					<button onClick={RandomizeActions.saveRandomizeResultToServer}>save result on server</button>
				</div>
				{/*{this.adminView()}*/}
				{this.normalUserView()}
				<UserFrequencyChart
					title={"user frequency last 7 days"}
					userFrequencyStatistics={Md.statistics.binds.userFrequencyLast7Days}
				/>
				<UserFrequencyChart
					title={"user frequency last 30 days"}
					userFrequencyStatistics={Md.statistics.binds.userFrequencyLast30Days}
				/>
			</div>
		);
	}

	public adminView() {
		return (
			<div>
				<RemoveableUserListView title={"all users"} users={Md.users.all.binds} />
				<UserListView title={"randomized users"} users={Md.randomize.randomizedOrder.order.binds} />
				<AddUserView />
			</div>
		);
	}

	public normalUserView() {
		return (
			<div>
				<UserListView title={"all users"} users={Md.users.all.binds} />
				<UserListView title={"randomized users"} users={Md.randomize.randomizedOrder.order.binds} />
			</div>
		);
	}
}

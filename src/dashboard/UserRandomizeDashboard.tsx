/*
 * a
 */

/*
 * a
 */

import React from "react";
import {ConnectedComponent} from "../common/actionFlow/components/ConnectedComponent";
import {Md} from "../globalModel/Md";
import {RandomizeActions} from "../randomize/RandomizeActions";
import {UserFrequencyChart} from "../statistics/userFrequency/UserFrequencyChart";
import {AddUserView} from "../user/AddUserView";
import {RemoveableUserListView} from "../user/RemoveableUserListView";
import {UserListView} from "../user/UserListView";

export class UserRandomizeDashboard extends ConnectedComponent<any, any> {
	public render() {
		return (
			<div className="group_v UserRandomizeDashboard">
				<div className="actions__container group_h">
					<button className="action__button" onClick={RandomizeActions.randomize}>
						randomize
					</button>
					<button className="action__button" onClick={RandomizeActions.saveRandomizeResultToServer}>
						save result on server
					</button>
				</div>
				<div className="group_h">
					{/*{this.adminView()}*/}
					{this.normalUserView()}
				</div>
				<div className="group_h">
					<UserFrequencyChart
						title={"user frequency last 7 days"}
						userFrequencyStatistics={Md.statistics.binds.userFrequencyLast7Days}
					/>
					<UserFrequencyChart
						title={"user frequency last 30 days"}
						userFrequencyStatistics={Md.statistics.binds.userFrequencyLast30Days}
					/>
				</div>
			</div>
		);
	}

	public adminView() {
		return [
			<RemoveableUserListView title={"all users"} users={Md.users.all.binds} />,
			<UserListView title={"randomized users"} users={Md.randomize.randomizedOrder.order.binds} />,
			<AddUserView />,
		];
	}

	public normalUserView() {
		return [
			<UserListView title={"all users"} users={Md.users.all.binds} />,
			<UserListView title={"randomized users"} users={Md.randomize.randomizedOrder.order.binds} />,
		];
	}
}

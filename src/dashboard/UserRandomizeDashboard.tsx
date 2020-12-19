/*
 * a
 */

/*
 * a
 */

import React from "react";
import {ConnectedComponent} from "../common/actionFlow/components/ConnectedComponent";
import {CSS} from "../CSS";
import {Md} from "../globalModel/Md";
import {RandomizeActions} from "../randomize/RandomizeActions";
import {UserFrequencyChart} from "../statistics/userFrequency/UserFrequencyChart";
import {AddUserView} from "../user/AddUserView";
import {RemoveableUserListView} from "../user/RemoveableUserListView";
import {UserListView} from "../user/UserListView";

export class UserRandomizeDashboard extends ConnectedComponent<any, any> {
	public render() {
		return (
			<div style={{...CSS.vGroup, fontFamily: "Verdana"}}>
				<div style={{...CSS.hGroup, ...CSS.actionsContainer}}>
					<button style={CSS.actionButton} onClick={RandomizeActions.randomize}>
						randomize
					</button>
					<button style={CSS.actionButton} onClick={RandomizeActions.saveRandomizeResultToServer}>
						save result on server
					</button>
				</div>
				<div style={{...CSS.hGroup}}>
					{/*{this.adminView()}*/}
					{this.normalUserView()}
				</div>
				<div style={{...CSS.hGroup}}>
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

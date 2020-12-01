/*
 * a
 */

/*
 * a
 */

import React from "react";
import {ConnectedComponent} from "./common/actionFlow/components/ConnectedComponent";
import {Md} from "./globalModel/Md";
import {RandomizeActions} from "./randomize/RandomizeActions";
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

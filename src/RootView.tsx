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
import {UserFrequencyChart} from "./randomize/UserFrequencyChart";
import {AddUserView} from "./user/AddUserView";
import {RemoveableUserListView} from "./user/RemoveableUserListView";
import {UserListView} from "./user/UserListView";
import {UserActions} from "./user/UserActions";

export class RootView extends ConnectedComponent<any, any> {
	public render() {
		return (
			<div>
				<div>
					<button onClick={UserActions.randomize}>randomize</button>
					<button onClick={UserActions.addRandomizeResultToServer}>accept result on server</button>
				</div>
				{/*{this.adminView()}*/}
				{this.normalUserView()}
				<UserFrequencyChart />
			</div>
		);
	}

	public adminView() {
		return (
			<div>
				<RemoveableUserListView title={"all users"} users={Md.users.all.binds} />
				<UserListView title={"randomized users"} users={Md.users.randomSorted.binds} />
				<AddUserView />
			</div>
		);
	}

	public normalUserView() {
		return (
			<div>
				<UserListView title={"all users"} users={Md.users.all.binds} />
				<UserListView title={"randomized users"} users={Md.users.randomSorted.binds} />
			</div>
		);
	}
}

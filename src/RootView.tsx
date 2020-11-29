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
import {AddUserView} from "./user/AddUserView";
import {UserListView} from "./user/UserListView";
import {UserActions} from "./user/UserActions";

export class RootView extends ConnectedComponent<any, any> {
	public render() {
		return (
			<div>
				<div>
					<button onClick={UserActions.randomize}>randomize</button>
					<button onClick={() => {}}>accept result on server</button>
					<button onClick={() => {}}>revoke last result</button>
				</div>
				<UserListView title={"all users"} users={Md.users.all.binds} />
				<UserListView title={"randomized users"} users={Md.users.randomSorted.binds} />
				<AddUserView />
			</div>
		);
	}
}

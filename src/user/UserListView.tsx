/*
 * a
 */

/*
 * a
 */

import React from "react";
import {BindArray} from "../common/actionFlow/binding/BindArray";
import {BaseProps} from "../common/actionFlow/components/BaseProps";
import {ConnectedComponent} from "../common/actionFlow/components/ConnectedComponent";
import {User} from "./User";

interface Props extends BaseProps {
	title: string;
	users: BindArray<User> | Array<User>;
}

export class UserListView extends ConnectedComponent<Props, any> {
	public render() {
		super.render();
		return (
			<div className="usersList">
				<h3>{this.props.title}</h3>
				{this.props.users.map((user) => (
					<div className="user__name">{user.name}</div>
				))}
			</div>
		);
	}
}

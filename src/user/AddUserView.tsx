/*
 * a
 */

/*
 * a
 */

import React from "react";
import {BaseProps} from "../common/actionFlow/components/BaseProps";
import {ConnectedComponent} from "../common/actionFlow/components/ConnectedComponent";
import {UserActions} from "./UserActions";
import {UserId} from "./UserId";

interface Props extends BaseProps {}

export class AddUserView extends ConnectedComponent<Props, any> {
	public inputId: HTMLInputElement;
	public inputName: HTMLInputElement;

	public addUser = () => {
		UserActions.addUser(this.inputId.value as UserId, this.inputName.value);
		this.inputId.value = "";
		this.inputName.value = "";
	};

	public render() {
		super.render();
		return (
			<div>
				<h3>add user</h3>
				<span>id: </span>
				<input ref={(c) => (this.inputId = c)} />
				<span>name: </span>
				<input ref={(c) => (this.inputName = c)} />
				<button onClick={this.addUser}>add</button>
			</div>
		);
	}
}

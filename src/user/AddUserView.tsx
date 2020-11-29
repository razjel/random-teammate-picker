/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-29
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */

import React from "react";
import {BaseProps} from "../common/actionFlow/components/BaseProps";
import {ConnectedComponent} from "../common/actionFlow/components/ConnectedComponent";
import {User} from "./User";
import {UserActions} from "./UserActions";

interface Props extends BaseProps {}

export class AddUserView extends ConnectedComponent<Props, any> {
	public inputId: HTMLInputElement;
	public inputName: HTMLInputElement;

	public addUser = () => {
		UserActions.addUser(new User(this.inputId.value, this.inputName.value));
		this.inputId.value = "";
		this.inputName.value = "";
	};

	public render() {
		super.render();
		return (
			<div>
				<input ref={(c) => (this.inputId = c)} title={`id`} />
				<input ref={(c) => (this.inputName = c)} title={`name`} />
				<button onClick={this.addUser}>add</button>
			</div>
		);
	}
}

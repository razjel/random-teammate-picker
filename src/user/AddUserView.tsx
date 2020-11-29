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
import {UserActions} from "./UserActions";

interface Props extends BaseProps {}

export class AddUserView extends ConnectedComponent<Props, any> {
	public inputName: HTMLInputElement;

	public addUser = () => {
		UserActions.addUser(this.inputName.value);
		this.inputName.value = "";
	};

	public render() {
		super.render();
		return (
			<div>
				<h3>add user</h3>
				<input ref={(c) => (this.inputName = c)} title={`name`} />
				<button onClick={this.addUser}>add</button>
			</div>
		);
	}
}

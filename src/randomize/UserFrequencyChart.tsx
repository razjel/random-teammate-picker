/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-30
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */

import React from "react";
import {BaseProps} from "../common/actionFlow/components/BaseProps";
import {ConnectedComponent} from "../common/actionFlow/components/ConnectedComponent";
import {Md} from "../globalModel/Md";

interface Props extends BaseProps {}

export class UserFrequencyChart extends ConnectedComponent<Props, any> {
	protected _onNewProps() {
		super._onNewProps();
		this.cleanInvalidatingProperties();
		this.addInvalidatingProperty(Md.randomize.binds.userFrequency);
	}

	public displayUserFrequency() {
		if (!Md.randomize.userFrequency) {
			return;
		}
		const result = [];
		for (const [userId, value] of Md.randomize.userFrequency.entries()) {
			result.push(
				<div>
					{userId}: {value}
				</div>
			);
		}
		return result;
	}

	public render() {
		console.log("UserFrequencyChart.render");
		return (
			<div>
				<h3>user frequency chart</h3>
				{this.displayUserFrequency()}
			</div>
		);
	}
}

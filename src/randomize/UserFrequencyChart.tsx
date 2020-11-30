/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-30
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */

import React from "react";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";
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

	public getChartData() {
		const data = [];
		if (Md.randomize.userFrequency) {
			for (const [userId, value] of Md.randomize.userFrequency.entries()) {
				data.push({userId, value});
			}
		}
		data.sort((a, b) => {
			if (a.value === b.value) {
				return 0;
			} else if (a.value > b.value) {
				return -1;
			} else {
				return 1;
			}
		});
		return data;
	}

	public render() {
		return (
			<div>
				<h3>user frequency chart</h3>
				<BarChart
					width={600}
					height={300}
					data={this.getChartData()}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="userId" />
					<YAxis />
					<Bar dataKey="value" fill="#8884d8" />
				</BarChart>
			</div>
		);
	}
}

/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-30
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */

import React from "react";
import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts";
import {BaseProps} from "../../common/actionFlow/components/BaseProps";
import {ConnectedComponent} from "../../common/actionFlow/components/ConnectedComponent";
import {UserQuery} from "../../user/UserQuery";
import {UserFrequencyStatistics} from "./UserFrequencyStatistics";

interface Props extends BaseProps {
	title: string;
	userFrequencyStatistics: UserFrequencyStatistics;
}

export class UserFrequencyChart extends ConnectedComponent<Props, any> {
	public getChartData() {
		const data = [];
		if (this.props.userFrequencyStatistics) {
			for (const [userId, value] of this.props.userFrequencyStatistics.entries()) {
				data.push({name: UserQuery.getUserName(userId), value});
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
			<div className="chart">
				<h3>{this.props.title}</h3>
				<BarChart
					width={600}
					height={200}
					data={this.getChartData()}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="name" />
					<YAxis />
					<Bar dataKey="value" fill="#8884d8" />
				</BarChart>
			</div>
		);
	}
}

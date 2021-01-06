/*
 * a
 */

/*
 * a
 */
import "/src/styles/build.scss";
import "firebase/database";
import React from "react";
import ReactDOM from "react-dom";
import {ActionFlowInit} from "./common/actionFlow/ActionFlowInit";
import {UserRandomizeDashboard} from "./dashboard/UserRandomizeDashboard";
import {FirebaseInitializer} from "./firebaseApi/FirebaseInitializer";
import {RandomizeActions} from "./randomize/RandomizeActions";
import {StatisticsActions} from "./statistics/StatisticsActions";
import {UserActions} from "./user/UserActions";

async function init() {
	FirebaseInitializer.initApp();
	FirebaseInitializer.initDatabase();
	ActionFlowInit({startBrowserFrameManager: true});
	await Promise.all([UserActions.listUsers(), RandomizeActions.refreshRandomizeHistory()]);
	StatisticsActions.calculateUserFrequency();
}

init();
ReactDOM.render(<UserRandomizeDashboard />, document.getElementById("app"));

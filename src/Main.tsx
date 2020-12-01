/*
 * a
 */

/*
 * a
 */
import "firebase/database";
import React from "react";
import ReactDOM from "react-dom";
import {ActionFlowInit} from "./common/actionFlow/ActionFlowInit";
import {FirebaseInitializer} from "./firebaseApi/FirebaseInitializer";
import {RandomizeActions} from "./randomize/RandomizeActions";
import {RootView} from "./RootView";
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
ReactDOM.render(<RootView />, document.getElementById("app"));

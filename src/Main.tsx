/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-21
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import "firebase/database";
import React from "react";
import ReactDOM from "react-dom";
import {ActionFlowInit} from "./common/actionFlow/ActionFlowInit";
import {FirebaseInitializer} from "./firebaseApi/FirebaseInitializer";
import {RootView} from "./RootView";
import {InitUsers} from "./user/InitUsers";

async function init() {
	FirebaseInitializer.initApp();
	FirebaseInitializer.initDatabase();
	ActionFlowInit({startBrowserFrameManager: true});
	await InitUsers.init();
}

init();
ReactDOM.render(<RootView />, document.body);

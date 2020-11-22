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
import {FirebaseInitializer} from "./FirebaseInitializer";
import {RootView} from "./RootView";

FirebaseInitializer.initApp();
FirebaseInitializer.initDatabase();

// async function test() {
// 	const users = await Md.db.query(DatabasePath.users);
// 	console.log("users:", users);
// 	const historyData = await Md.db.query(DatabasePath.historyTeamRand);
// 	console.log("historyData:", historyData);
// }

ReactDOM.render(<RootView />, document.createElement("div"));

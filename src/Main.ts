/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-21
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import firebase from "firebase/app";

export class Main {
	public static init() {
		const config = {
			apiKey: "AAAAf-02tKc:APA91bGI66s_kJAOH1YBSNTRyZK2EBPzy4dA_e_EMeuBDatM4C3YsN593Cn9_1IaZxPUWtnq50lZhNCCh15gUlx7tG-i0KyKEm-h70fE22FxjjKuAKMk9J5vReeRKDeQ_sHW-PelEqCo",
			authDomain: "random-teammate-picker.firebaseapp.com",
			databaseURL: "https://random-teammate-picker.firebaseio.com/",
			storageBucket: "random-teammate-picker.appspot.com"
		};
		firebase.initializeApp(config);

		const database = firebase.database();
		database.ref(`users`).on("value", function(snapshot) {
			console.log(snapshot.val());
		}, function (errorObject) {
			console.log("The read failed: " + errorObject.code);
		});
		console.log("database:", (database));
	}
}


Main.init();
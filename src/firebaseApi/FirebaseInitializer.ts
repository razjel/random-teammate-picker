import firebase from "firebase";
import {DatabaseWrapper} from "./DatabaseWrapper";
import {Md} from "../globalModel/Md";
import {UserApi} from "./user/UserApi";

/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-21
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
export class FirebaseInitializer {
	public static initApp(): void {
		const config = {
			apiKey:
				"AAAAf-02tKc:APA91bGI66s_kJAOH1YBSNTRyZK2EBPzy4dA_e_EMeuBDatM4C3YsN593Cn9_1IaZxPUWtnq50lZhNCCh15gUlx7tG-i0KyKEm-h70fE22FxjjKuAKMk9J5vReeRKDeQ_sHW-PelEqCo",
			authDomain: "random-teammate-picker.firebaseapp.com",
			databaseURL: "https://random-teammate-picker.firebaseio.com/",
			storageBucket: "random-teammate-picker.appspot.com",
		};
		firebase.initializeApp(config);
	}

	public static initDatabase(): void {
		const db = new DatabaseWrapper(firebase.database());
		Md.userApi = new UserApi(db);
	}
}

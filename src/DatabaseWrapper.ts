/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-21
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import firebase from "firebase";
import Database = firebase.database.Database;
import DataSnapshot = firebase.database.DataSnapshot;

export class DatabaseWrapper {
	private firebaseDatabase: Database;

	constructor(firebaseDatabase: Database) {
		this.firebaseDatabase = firebaseDatabase;
	}

	public query(path: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this.firebaseDatabase.ref(path).on("value", (snapshot: DataSnapshot) => {
				resolve(snapshot.val());
			}, (errorObject) => {
				reject(errorObject.code);
			});
		});
	}
}
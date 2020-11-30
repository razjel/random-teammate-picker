/**
 * Created by Szczepan Czaicki, s.czaicki@getprintbox.com
 * Date: 2020-11-21
 *
 * Copyright (c) 2015, Printbox www.getprintbox.com
 * All rights reserved.
 */
import firebase from "firebase";

export class DatabaseWrapper {
	private firebaseDatabase: firebase.database.Database;

	constructor(firebaseDatabase: firebase.database.Database) {
		this.firebaseDatabase = firebaseDatabase;
	}

	public query(path: string): Promise<any> {
		return new Promise((resolve, reject) => {
			this.firebaseDatabase.ref(path).on(
				"value",
				(snapshot: firebase.database.DataSnapshot) => {
					resolve(snapshot.val());
				},
				(errorObject) => {
					reject(errorObject.code);
				}
			);
		});
	}

	public add(path: string, id: string, value: any): Promise<void> {
		return this.firebaseDatabase.ref(path).push(id).set(value);
	}

	public async listAdd(path: string, value: any): Promise<string> {
		const ref = this.firebaseDatabase.ref(path).push();
		await ref.set(value);
		return ref.key;
	}

	public remove(path: string, id: any): Promise<any> {
		return this.firebaseDatabase.ref(`${path}/${id}`).set(null);
	}
}

/*
 * a
 */

/*
 * a
 */
import firebase from "firebase";

export class DatabaseWrapper {
	private firebaseDatabase: firebase.database.Database;

	constructor(firebaseDatabase: firebase.database.Database) {
		this.firebaseDatabase = firebaseDatabase;
	}

	public query(path: string): Promise<any> {
		return new Promise((resolve) => {
			this.firebaseDatabase
				.ref(path)
				.get()
				.then((result) => resolve(result.val()));
		});
	}

	public add(path: string, value: any): Promise<void> {
		return this.firebaseDatabase.ref(path).set(value);
	}

	public remove(path: string): Promise<any> {
		return this.firebaseDatabase.ref(path).set(null);
	}

	public async pushToArray(path: string, value: any): Promise<any> {
		return this.firebaseDatabase.ref(path).push().set(value);
	}
}

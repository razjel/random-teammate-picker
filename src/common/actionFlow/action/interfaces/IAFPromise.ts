/*
 * a
 */

/*
 * a
 */

export interface IAFPromise<T = any> extends Promise<T> {
	terminate?(): void;
	dontTrack?(): void;
}

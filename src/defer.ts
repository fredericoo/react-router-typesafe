import { defer as rrDefer } from 'react-router-dom';

/** Unfortunately DeferredData is not exported by react-router-dom so we have to re-declare it */
export declare class DeferredData<TData extends Record<string, unknown>> {
	private pendingKeysSet;
	private controller;
	private abortPromise;
	private unlistenAbortSignal;
	private subscribers;
	data: TData;
	init?: ResponseInit;
	deferredKeys: string[];
	constructor(data: Record<string, unknown>, responseInit?: ResponseInit);
	private trackPromise;
	private onSettle;
	private emit;
	subscribe(fn: (aborted: boolean, settledKey?: string) => void): () => boolean;
	cancel(): void;
	resolveData(signal: AbortSignal): Promise<boolean>;
	get done(): boolean;
	get unwrappedData(): {};
	get pendingKeys(): string[];
}
type DeferFunction = <T extends Record<string, unknown>>(data: T, init?: number | ResponseInit) => DeferredData<T>;

/** Patch of react router’s defer to support generics. */
export const defer = rrDefer as unknown as DeferFunction;

import { Await as RRAwait } from 'react-router-dom';

export type AwaitResolveRenderFunction<T> = {
	(data: Awaited<T>): React.ReactNode;
};

export type AwaitProps<T> = {
	children: React.ReactNode | AwaitResolveRenderFunction<T>;
	errorElement?: React.ReactNode;
	resolve: T;
};

export const Await = RRAwait as <T>(props: AwaitProps<T>) => React.ReactNode;

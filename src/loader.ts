import {
	LoaderFunction,
	useLoaderData as rrUseLoaderData,
	useRouteLoaderData as rrUseRouteLoaderData,
} from 'react-router-dom';
import { DeferredData } from './defer';

export type LoaderData<TLoaderFn extends LoaderFunction> = Awaited<ReturnType<TLoaderFn>> extends Response | infer D
	? D extends DeferredData<infer TDeferred>
		? TDeferred
		: D
	: never;

/** Returns the loader data for the nearest ancestor Route loader
 * @example
 * const data = useLoaderData<typeof loader>();
 */
export const useLoaderData = rrUseLoaderData as <TLoaderFn extends LoaderFunction>() => LoaderData<TLoaderFn>;

export const useRouteLoaderData = rrUseLoaderData as <TLoaderFn extends LoaderFunction>(
	routeId: string,
) => LoaderData<TLoaderFn>;

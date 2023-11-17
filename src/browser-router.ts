import { RouteObject, createBrowserRouter } from 'react-router-dom';
import { F } from 'ts-toolbelt';

type ExtractParam<Path, NextPart> = Path extends `:${infer Param}` ? Record<Param, string> & NextPart : NextPart;

type ExtractParams<Path> = Path extends `${infer Segment}/${infer Rest}`
	? ExtractParam<Segment, ExtractParams<Rest>>
	: ExtractParam<Path, {}>;

type TypesafeRouteParams<Routes extends RouteObject[]> = {
	[K in keyof Routes]: Routes[K] extends { path: string; children: RouteObject[] }
		?
				| { path: Routes[K]['path']; pathParams: ExtractParams<Routes[K]['path']> }
				| TypesafeRouteParams<Routes[K]['children']>
		: Routes[K] extends { path: string }
		? { path: Routes[K]['path']; pathParams: ExtractParams<Routes[K]['path']> }
		: never;
}[number];

type TypesafeSearchParams = Record<string, string> | URLSearchParams;
export type RouteExtraParams = { hash?: string; searchParams?: TypesafeSearchParams };

function invariant(condition: any, message?: string): asserts condition {
	if (condition) return;
	throw new Error(message);
}

const joinValidWith =
	(separator: string) =>
	(...valid: any[]) =>
		valid.filter(Boolean).join(separator);

function assertPathAndParams(params: unknown): asserts params is { path: string; pathParams: Record<string, string> } {
	invariant(params && typeof params === 'object' && 'path' in params && 'pathParams' in params);
	invariant(typeof params.path === 'string');
	invariant(typeof params.pathParams === 'object' && params.pathParams !== null);
}

export const typesafeBrowserRouter = <R extends RouteObject>(routes: F.Narrow<R[]>) => {
	return {
		router: createBrowserRouter(routes as RouteObject[]),
		href: (route: TypesafeRouteParams<R[]> & RouteExtraParams) => {
			assertPathAndParams(route);
			let path = route.path;
			// applies all params to the path
			for (const param in route.pathParams) {
				path = route.path.replace(`:${param}`, route.pathParams[param] as string);
			}
			const searchParams = new URLSearchParams(route.searchParams);
			const hash = route.hash?.replace(/^#/, '');

			return joinValidWith('#')(joinValidWith('?')(path, searchParams.toString()), hash);
		},
	};
};

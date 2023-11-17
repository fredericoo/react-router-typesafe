import { RouteObject, createBrowserRouter } from 'react-router-dom';
import { F } from 'ts-toolbelt';

type PathParams<T> = keyof T extends never ? { pathParams?: never } : { pathParams: T };

type ExtractParam<Path, NextPart> = Path extends `:${infer Param}` ? Record<Param, string> & NextPart : NextPart;

type ExtractParams<Path> = Path extends `${infer Segment}/${infer Rest}`
	? ExtractParam<Segment, ExtractParams<Rest>>
	: ExtractParam<Path, {}>;

type PathWithParams<P extends string | undefined> = P extends string
	? { path: P } & PathParams<ExtractParams<P>>
	: never;

type TypesafeRouteParams<Routes extends RouteObject[]> = {
	[K in keyof Routes]: Routes[K] extends { children: infer C extends RouteObject[] }
		? PathWithParams<Routes[K]['path']> | TypesafeRouteParams<C>
		: PathWithParams<Routes[K]['path']>;
}[number];

type TypesafeSearchParams = Record<string, string> | URLSearchParams;
export type RouteExtraParams = { hash?: string; searchParams?: TypesafeSearchParams };

const joinValidWith =
	(separator: string) =>
	(...valid: any[]) =>
		valid.filter(Boolean).join(separator);

export const typesafeBrowserRouter = <R extends RouteObject>(routes: F.Narrow<R[]>) => {
	return {
		router: createBrowserRouter(routes as RouteObject[]),
		href: (route: TypesafeRouteParams<R[]> & RouteExtraParams) => {
			// applies all params to the path
			const path = route.pathParams
				? Object.keys(route.pathParams).reduce((path, param) => {
						return path.replace(`:${param}`, route.pathParams![param as keyof typeof route.pathParams]);
				  }, route.path)
				: route.path;

			const searchParams = new URLSearchParams(route.searchParams);
			const hash = route.hash?.replace(/^#/, '');

			return joinValidWith('#')(joinValidWith('?')(path, searchParams.toString()), hash);
		},
	};
};

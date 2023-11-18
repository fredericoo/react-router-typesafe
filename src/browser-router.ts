import { RouteObject, createBrowserRouter } from 'react-router-dom';
import { F } from 'ts-toolbelt';

type Flatten<T> = { [K in keyof T]: T[K] } & {};

type PathParams<T> = keyof T extends never ? { params?: never } : { params: T };

type ExtractParam<Path, NextPart> = Path extends `:${infer Param}` ? Record<Param, string> & NextPart : NextPart;

type ExtractParams<Path> = Path extends `${infer Segment}/${infer Rest}`
	? ExtractParam<Segment, ExtractParams<Rest>>
	: ExtractParam<Path, {}>;

type ExtractPaths<Route extends RouteObject> = Route extends { children: infer C extends RouteObject[] }
	? Route['path'] | ExtractPaths<C[number]>
	: Route['path'];

type TypesafeSearchParams = Record<string, string> | URLSearchParams;
export type RouteExtraParams = { hash?: string; searchParams?: TypesafeSearchParams };

const joinValidWith =
	(separator: string) =>
	(...valid: any[]) =>
		valid.filter(Boolean).join(separator);

export const typesafeBrowserRouter = <R extends RouteObject>(routes: F.Narrow<R[]>) => {
	function href<P extends ExtractPaths<R>>(
		path: Extract<P, string>,
		params?: PathParams<Flatten<ExtractParams<P>>> & RouteExtraParams,
	) {
		// applies all params to the path
		const replacedPath = params?.params
			? Object.keys(params.params).reduce((path, param) => {
					const value = params.params![param as keyof ExtractParams<P>];
					if (typeof value !== 'string') throw new Error(`Route param ${param} must be a string`);
					return path.replace(`:${param}`, value);
			  }, path)
			: path;

		const searchParams = new URLSearchParams(params?.searchParams);
		const hash = params?.hash?.replace(/^#/, '');

		return joinValidWith('#')(joinValidWith('?')(replacedPath, searchParams.toString()), hash);
	}

	return {
		router: createBrowserRouter(routes as RouteObject[]),
		href,
	};
};

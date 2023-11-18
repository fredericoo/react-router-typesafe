import { RouteObject, createBrowserRouter } from 'react-router-dom';

type Narrowable = string | number | bigint | boolean;
type NarrowKeys<A> =
	| (A extends Narrowable ? A : never)
	| { [K in keyof A]: A[K] extends Function ? A[K] : NarrowKeys<A[K]> };

type NarrowArray<A> = NarrowKeys<A>[];

type Flatten<T> = { [K in keyof T]: T[K] } & {};

type PathParams<T> = keyof T extends never ? { params?: never } : { params: T };

type ExtractParam<Path, NextPart> = Path extends `:${infer Param}` ? Record<Param, string> & NextPart : NextPart;

type ExtractParams<Path> = Path extends `${infer Segment}/${infer Rest}`
	? ExtractParam<Segment, ExtractParams<Rest>>
	: ExtractParam<Path, {}>;

type ExtractPaths<Route extends RouteObject> = Route extends {
	children: infer C extends RouteObject[];
	path: infer P extends string;
}
	? P | ExtractPaths<C[number]>
	: Route extends { children: infer C extends RouteObject[] }
	? ExtractPaths<C[number]>
	: Route extends { path: infer P extends string }
	? P
	: never;

type TypesafeSearchParams = Record<string, string> | URLSearchParams;
export type RouteExtraParams = { hash?: string; searchParams?: TypesafeSearchParams };

const joinValidWith =
	(separator: string) =>
	(...valid: any[]) =>
		valid.filter(Boolean).join(separator);

export const typesafeBrowserRouter = <R extends RouteObject>(routes: NarrowArray<R>) => {
	type Paths = ExtractPaths<R>;

	function href<P extends Paths>(
		params: { path: Extract<P, string> } & PathParams<Flatten<ExtractParams<P>>> & RouteExtraParams,
	) {
		// applies all params to the path
		const path = params?.params
			? Object.keys(params.params).reduce((path, param) => {
					const value = params.params![param as keyof ExtractParams<P>];
					if (typeof value !== 'string') throw new Error(`Route param ${param} must be a string`);
					return path.replace(`:${param}`, value);
			  }, params.path)
			: params.path;

		const searchParams = new URLSearchParams(params?.searchParams);
		const hash = params?.hash?.replace(/^#/, '');

		return joinValidWith('#')(joinValidWith('?')(path, searchParams.toString()), hash);
	}

	return {
		router: createBrowserRouter(routes as RouteObject[]),
		href,
	};
};

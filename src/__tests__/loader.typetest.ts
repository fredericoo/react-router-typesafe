import { test } from 'bun:test';
import { LoaderFunction, json, redirect } from 'react-router-dom';
import { useLoaderData } from '..';
/** TODO: wait for feedback on issue about act-compat importing deprecated "react-dom/test-utils" */
import { renderHook } from '@testing-library/react';
import { expectTypeOf } from 'expect-type';
import { useRouteLoaderData } from '../loader';

test('works with non-promises', () => {
	const testLoader = (() => {
		return { foo: 'bar' };
	}) satisfies LoaderFunction;

	const { result } = renderHook(useLoaderData<typeof testLoader>);
	expectTypeOf(result.current).toEqualTypeOf<{ foo: string }>();
});

test('works with promises', () => {
	const testLoader = (() => {
		return Promise.resolve({ foo: 'bar' });
	}) satisfies LoaderFunction;

	const { result } = renderHook(useLoaderData<typeof testLoader>);
	expectTypeOf(result.current).toEqualTypeOf<{ foo: string }>();
});

test('works with mixed values', () => {
	const testLoader = (() => {
		if (Math.random() > 0.5) {
			return { bar: 'baz' };
		}
		return { foo: 'bar' };
	}) satisfies LoaderFunction;

	const { result } = renderHook(useLoaderData<typeof testLoader>);
	expectTypeOf(result.current).toEqualTypeOf<
		| {
				bar: string;
				foo?: never;
		  }
		| {
				foo: string;
				bar?: never;
		  }
	>();
});

test('works with redirects', () => {
	const testLoader = (() => {
		if (Math.random() > 0.5) {
			return redirect('/foo');
		}
		return { foo: 'bar' };
	}) satisfies LoaderFunction;

	const { result } = renderHook(useLoaderData<typeof testLoader>);
	expectTypeOf(result.current).toEqualTypeOf<{ foo: string }>();
});

test('routeLoaderData works the same way as useLoaderData', () => {
	const testLoader = (() => {
		if (Math.random() > 0.5) {
			return redirect('/foo');
		}
		return { foo: 'bar' };
	}) satisfies LoaderFunction;

	const { result } = renderHook(() => useRouteLoaderData<typeof testLoader>('test'));
	expectTypeOf(result.current).toEqualTypeOf<{ foo: string }>();
});

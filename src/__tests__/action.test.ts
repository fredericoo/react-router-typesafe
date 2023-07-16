import { test, expectTypeOf } from 'vitest';
import { LoaderFunction, redirect } from 'react-router-dom';
import { useLoaderData } from '..';

test('works with non-promises', () => {
	const testLoader = (() => {
		return { foo: 'bar' };
	}) satisfies LoaderFunction;

	const data = useLoaderData<typeof testLoader>();
	expectTypeOf(data).toEqualTypeOf<{ foo: string }>();
});

test('works with promises', () => {
	const testLoader = (() => {
		return Promise.resolve({ foo: 'bar' });
	}) satisfies LoaderFunction;

	const data = useLoaderData<typeof testLoader>();
	expectTypeOf(data).toEqualTypeOf<{ foo: string }>();
});

test('works with mixed values', () => {
	const testLoader = (() => {
		if (Math.random() > 0.5) {
			return { bar: 'baz' };
		}
		return { foo: 'bar' };
	}) satisfies LoaderFunction;

	const data = useLoaderData<typeof testLoader>();
	expectTypeOf(data).toEqualTypeOf<
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

	const data = useLoaderData<typeof testLoader>();
	expectTypeOf(data).toEqualTypeOf<{ foo: string }>(data);
});

import { test } from 'bun:test';
import { ActionFunction, LoaderFunction, redirect } from 'react-router-dom';
import { useActionData } from '..';
/** TODO: wait for feedback on issue about act-compat importing deprecated "react-dom/test-utils" */
import { renderHook } from '@testing-library/react';
import { expectTypeOf } from 'expect-type';

test('works with non-promises', () => {
	const testAction = (() => {
		return { foo: 'bar' };
	}) satisfies ActionFunction;

	const { result } = renderHook(useActionData<typeof testAction>);
	expectTypeOf(result.current).toEqualTypeOf<{ foo: string } | undefined>();
});

test('works with promises', () => {
	const testAction = (async () => {
		return { foo: 'bar' };
	}) satisfies ActionFunction;

	const { result } = renderHook(useActionData<typeof testAction>);
	expectTypeOf(result.current).toEqualTypeOf<{ foo: string } | undefined>();
});

test('ignores redirects or responses', () => {
	const testAction = (() => {
		if (Math.random() > 0.5) {
			return redirect('/foo');
		}
		if (Math.random() > 0.5) {
			return new Response(null, {});
		}
		return { foo: 'bar' };
	}) satisfies ActionFunction;

	const { result } = renderHook(useActionData<typeof testAction>);
	expectTypeOf(result.current).toEqualTypeOf<{ foo: string } | undefined>();
});

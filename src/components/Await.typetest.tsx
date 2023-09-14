import { test } from 'bun:test';
import { expectTypeOf } from 'expect-type';
import { Await } from './Await';

test('render props return awaited promise resolved value', () => {
	const promiseThatReturnsNumber = Promise.resolve(1);

	const rendered = Await({
		resolve: promiseThatReturnsNumber,
		children: resolved => {
			expectTypeOf(resolved).toEqualTypeOf<number>();
			return resolved;
		},
	});
});

test('does not error/warn with non-promises', () => {
	const rendered = Await({
		resolve: 1,
		children: resolved => {
			expectTypeOf(resolved).toEqualTypeOf<number>();
			return resolved;
		},
	});
});

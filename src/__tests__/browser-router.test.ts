import { test, expect } from 'bun:test';
import { typesafeBrowserRouter } from '../browser-router';

test('returns pathname with replaced params', () => {
	const { href } = typesafeBrowserRouter([
		{ path: '/blog', children: [{ path: '/blog/:postId', children: [{ path: '/blog/:postId/:commentId' }] }] },
	]);

	const output = href({ path: '/blog/:postId/:commentId', pathParams: { postId: 'foo', commentId: 'bar' } });

	expect(output).toEqual('/blog/foo/bar');
});

test('returns pathname with search params if object is passed', () => {
	const { href } = typesafeBrowserRouter([{ path: '/blog', children: [{ path: '/blog/:postId' }] }]);

	const output = href({ path: '/blog/:postId', pathParams: { postId: 'foo' }, searchParams: { foo: 'bar' } });

	expect(output).toEqual('/blog/foo?foo=bar');
});

test('returns pathname with search params if URLSearchParams is passed', () => {
	const { href } = typesafeBrowserRouter([{ path: '/blog', children: [{ path: '/blog/:postId' }] }]);

	const output = href({
		path: '/blog/:postId',
		pathParams: { postId: 'foo' },
		searchParams: new URLSearchParams({ foo: 'bar' }),
	});

	expect(output).toEqual('/blog/foo?foo=bar');
});

test('returns pathname with hash', () => {
	const { href } = typesafeBrowserRouter([{ path: '/blog', children: [{ path: '/blog/:postId' }] }]);

	const output = href({ path: '/blog/:postId', pathParams: { postId: 'foo' }, hash: '#foo' });

	expect(output).toEqual('/blog/foo#foo');
});

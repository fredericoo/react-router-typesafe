import { test, expect } from 'bun:test';
import { typesafeBrowserRouter } from '../browser-router';

test('returns pathname with replaced params', () => {
	const { href } = typesafeBrowserRouter([
		{ path: '/blog', children: [{ path: '/blog/:postId', children: [{ path: '/blog/:postId/:commentId' }] }] },
	]);

	const output = href({ path: '/blog/:postId/:commentId', params: { postId: 'foo', commentId: 'bar' } });

	expect(output).toEqual('/blog/foo/bar');
});

test('Returns right paths with pathless routes with children', () => {
	const Component = () => null;
	const { href } = typesafeBrowserRouter([
		{
			id: 'auth',
			Component,
			children: [{ path: '/dashboard' }],
		},
		{
			id: 'public',
			children: [
				{ path: '/blog', children: [{ path: '/blog/:postId', children: [{ path: '/blog/:postId/:commentId' }] }] },
			],
		},
	]);

	const output = href({ path: '/blog/:postId/:commentId', params: { postId: 'foo', commentId: 'bar' } });

	expect(output).toEqual('/blog/foo/bar');
});

test('returns pathname with search params if object is passed', () => {
	const { href } = typesafeBrowserRouter([{ path: '/blog', children: [{ path: '/blog/:postId' }] }]);

	const output = href({ path: '/blog/:postId', params: { postId: 'foo' }, searchParams: { foo: 'bar' } });

	expect(output).toEqual('/blog/foo?foo=bar');
});

test('returns pathname with search params if URLSearchParams is passed', () => {
	const { href } = typesafeBrowserRouter([{ path: '/blog', children: [{ path: '/blog/:postId' }] }]);

	const output = href({
		path: '/blog/:postId',
		params: { postId: 'foo' },
		searchParams: new URLSearchParams({ foo: 'bar' }),
	});

	expect(output).toEqual('/blog/foo?foo=bar');
});

test('returns pathname with hash', () => {
	const { href } = typesafeBrowserRouter([{ path: '/blog', children: [{ path: '/blog/:postId' }] }]);

	const output = href({ path: '/blog/:postId', params: { postId: 'foo' }, hash: '#foo' });

	expect(output).toEqual('/blog/foo#foo');
});

test('typescript stress test with many routes and layers', () => {
	const { href } = typesafeBrowserRouter([
		{
			path: '/blog',
			children: [
				{
					path: '/blog/:postId',
					children: [
						{ path: '/blog/:postId/:commentId' },
						{ path: '/blog/:postId/:commentId/:replyId' },
						{ path: '/blog/:postId/:commentId/:replyId/:fooId' },
						{ path: '/blog/:postId/:commentId/:replyId/:fooId/:barId' },
						{ path: '/blog/:postId/:commentId/:replyId/:fooId/:barId/:bazId' },
						{ path: '/blog/:postId/:commentId/:replyId/:fooId/:barId/:bazId/:quxId' },
						{ path: '/blog/:postId/:commentId/:replyId/:fooId/:barId/:bazId/:quxId/:quuxId' },
						{ path: '/blog/:postId/:commentId/:replyId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId' },
						{ path: '/blog/:postId/:commentId/:replyId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId' },
						{
							path: '/blog/:postId/:commentId/:replyId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId/:garplyId',
						},
						{
							path: '/blog/:postId/:commentId/:replyId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId/:garplyId/:waldoId',
						},
						{
							path: '/blog/:postId/:commentId/:replyId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId/:garplyId/:waldoId/:fredId',
						},
						{
							path: '/blog/:postId/:commentId/:replyId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId/:garplyId/:waldoId/:fredId/:plughId',
						},
						{
							path: '/blog/:postId/:commentId/:replyId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId/:garplyId/:waldoId/:fredId/:plughId/:xyzzyId',
						},
					],
				},
			],
		},
		{
			path: '/dashboard',
			children: [
				{
					path: '/dashboard/:dashboardId',
					children: [
						{ path: '/dashboard/:dashboardId/:fooId' },
						{ path: '/dashboard/:dashboardId/:fooId/:barId' },
						{ path: '/dashboard/:dashboardId/:fooId/:barId/:bazId' },
						{ path: '/dashboard/:dashboardId/:fooId/:barId/:bazId/:quxId' },
						{ path: '/dashboard/:dashboardId/:fooId/:barId/:bazId/:quxId/:quuxId' },
						{ path: '/dashboard/:dashboardId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId' },
						{ path: '/dashboard/:dashboardId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId' },
						{ path: '/dashboard/:dashboardId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId/:garplyId' },
						{
							path: '/dashboard/:dashboardId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId/:garplyId/:waldoId',
						},
						{
							path: '/dashboard/:dashboardId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId/:garplyId/:waldoId/:fredId',
						},
						{
							path: '/dashboard/:dashboardId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId/:garplyId/:waldoId/:fredId/:plughId',
						},
						{
							path: '/dashboard/:dashboardId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId/:garplyId/:waldoId/:fredId/:plughId/:xyzzyId',
						},
					],
				},
			],
		},
		{
			path: '/profile',
			children: [
				{
					path: '/profile/:profileId',
					children: [
						{ path: '/profile/:profileId/:fooId' },
						{ path: '/profile/:profileId/:fooId/:barId' },
						{ path: '/profile/:profileId/:fooId/:barId/:bazId' },
						{ path: '/profile/:profileId/:fooId/:barId/:bazId/:quxId' },
						{ path: '/profile/:profileId/:fooId/:barId/:bazId/:quxId/:quuxId' },
						{ path: '/profile/:profileId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId' },
						{ path: '/profile/:profileId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId' },
						{ path: '/profile/:profileId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId/:garplyId' },
						{ path: '/profile/:profileId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId/:garplyId/:waldoId' },
						{
							path: '/profile/:profileId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId/:garplyId/:waldoId/:fredId',
						},
						{
							path: '/profile/:profileId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId/:garplyId/:waldoId/:fredId/:plughId',
						},
						{
							path: '/profile/:profileId/:fooId/:barId/:bazId/:quxId/:quuxId/:corgeId/:graultId/:garplyId/:waldoId/:fredId/:plughId/:xyzzyId',
						},
					],
				},
			],
		},
	]);

	const output = href({ path: '/blog' });

	expect(output).toEqual('/blog');
});

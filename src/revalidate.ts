import type { ShouldRevalidateFunction } from 'react-router-dom';

export type RevalidateWhenFunctionArgs = {
	/** Will revalidate if any of the dependencies change. This is an **OR**. */
	deps: {
		/** Will revalidate if any of these **URL Params** have changed.
		 * @example for `/users/:id/posts/:postId` you could pass `['id', 'postId]`
		 * to revalidate loader when the `id` **or** `postId` params changed.
		 */
		params?: string[];
		/** Will revalidate loader if **any** of these search params change value */
		search?: string[];
		/** Will revalidate if there’s a form submission with the encoding type */
		submission?: 'any' | 'formdata' | 'json' | 'text';
		/** Escape hatch for the default shouldRevalidate function. Note that `defaultShouldRevalidate` here will be true
		 * if any of the dependencies have changed, so you can use this to override that behavior. */
		shouldRevalidate?: ShouldRevalidateFunction;
	};
	/** Will not revalidate if the time in milliseconds between the last call to the loader and now is less than this value.
	 * This is an **OR** with the other dependencies, so it will revalidate if the time has passed **OR** any of the other dependencies have changed.
	 * @example for `1000` will revalidate if the last call was more than 1 second ago, regardless of changes.
	 */
	olderThanMs?: number;
};

export const revalidateWhen = ({ deps, olderThanMs }: RevalidateWhenFunctionArgs): ShouldRevalidateFunction => {
	let lastLoadedAt = 0;
	return ({ defaultShouldRevalidate, ...params }) => {
		const depsChanged = (() => {
			if (deps.params?.some(param => params.nextParams[param] !== params.currentParams[param])) {
				return true;
			}
			if (
				deps.search?.some(param => params.currentUrl.searchParams.get(param) === params.nextUrl.searchParams.get(param))
			) {
				return true;
			}

			switch (deps.submission) {
				case 'any':
					if (params.formData || params.json || params.text) return true;
					break;
				case 'formdata':
					if (params.formData) return true;
					break;
				case 'json':
					if (params.json) return true;
					break;
				case 'text':
					if (params.text) return true;
					break;
			}

			return false;
		})();

		const now = Date.now();
		const stale = olderThanMs ? now - lastLoadedAt < olderThanMs : false;

		const revalidate = stale || depsChanged;

		return deps.shouldRevalidate?.({ defaultShouldRevalidate: revalidate, ...params }) ?? revalidate;
	};
};

const shouldRevalidate = revalidateWhen({
	deps: { params: ['id'], search: ['q'] },
	olderThanMs: 1000,
});

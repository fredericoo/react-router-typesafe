# React Router Typesafe

React Router Typesafe is a minimal (235 bytes gzipped) patch built upon [react-router](https://github.com/remix-run/react-router) to add type-safety via the use of generics. It brings type functionality closer to Remix, the full-stack framework from the same authors.

## Getting Started

Install the package:

```bash
npm install react-router-typesafe
```

Replace your imports from `react-router` to `react-router-typesafe`:

```diff
- import { defer, useLoaderData, useActionData } from "react-router";
+ import { defer, useLoaderData, useActionData } from "react-router-typesafe";
```

## Usage

### useLoaderData / useActionData

```tsx
import { useLoaderData, useActionData, LoaderFunction, ActionFunction } from 'react-router-typesafe';

const loader = (() => ({ message: 'Hello World' })) satisfies LoaderFunction;

const action = (() => ({ ok: true })) satisfies ActionFunction;

const Component = () => {
	const data = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();

	return <div>{data.message}</div>;
};
```

> **Warning**
> Do not annotate the type of the loader/action function. It will break the type-safety. Instead rely on either the `satisfies` keyword from Typescript 4.9 onwards, or the `makeLoader` / `makeAction` utilities proveded by this library.

## Utilities

### makeLoader / makeAction

The `makeLoader` and `makeAction` utils replace the need for the `satisfies` keyword without adding any runtime overhead.

```tsx
import { makeLoader, makeAction } from 'react-router-typesafe';

const loader = makeLoader(() => ({ message: 'Hello World' }));

const action = makeAction(() => ({ ok: true }));
```

### typesafeBrowserRouter ❇️ NEW

The `typesafeBrowserRouter` is a wrapper around `createBrowserRoute` that returns a `href` function in addition to the routes.

It’s easy to incrementally adopt, and you can use `href` anywhere, not just in `<Link>` components.

Set up your routes like this:

```diff
- import { createBrowserRouter } from "react-router-dom";
+ import { typesafeBrowserRouter } from "react-router-typesafe";

- export const router = createBrowserRouter([
+ export const { router, href } = typesafeBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/projects/:projectId", Component: ProjectPage },
]);
```

- ✅ No need to change your existing `<Link>` components.
- ✅ URL params are inferred and type-checked.
- ✅ Supports query params and URL hash
- ✅ Refactor-friendly: **Rename Symbol** on the route path and it’ll be updated everywhere.

Then use `href` to generate URLs:

```tsx
import { Link } from 'react-router-dom';
import { href } from './router';

const ProjectCard = (props: { id: string }) => {
	return (
		<Link to={href({ path: '/projects/:projectId', params: { projectId: props.id } })}>
			<p>Project {projectId}</p>
		</Link>
	);
};
```

## Contributing

Feel free to improve the code and submit a pull request. If you're not sure about something, create an issue first to discuss it.

## Functions

| Status | Utility                 | Before     | After                                                        |
| ------ | ----------------------- | ---------- | ------------------------------------------------------------ |
| ✅     | `defer`                 | `Response` | Generic matching the first argument                          |
|        | `json`                  | `Response` | Serialized data passed in                                    |
| ✅     | `useLoaderData`         | `unknown`  | Generic function with the type of the loader function passed |
| ✅     | `useActionData`         | `unknown`  | Generic function with the type of the action function passed |
| ✅     | `useRouteLoaderData`    | `unknown`  | Generic function with the type of the loader function passed |
| NEW    | `makeLoader`            |            | Wrapper around `satisfies` for ergonomics                    |
| NEW    | `makeAction`            |            | Wrapper around `satisfies` for ergonomics                    |
| NEW    | `typesafeBrowserRouter` |            | Extension of `createBrowserRouter`                           |

## Patched components

| Status | Component | Before                                        | After                                         |
| ------ | --------- | --------------------------------------------- | --------------------------------------------- |
| ✅     | `<Await>` | children render props would be typed as `any` | Generic component makes render props typesafe |

## About

React Router is developed and maintained by [Remix Software](https://remix.run) and many [amazing contributors](https://github.com/remix-run/react-router/graphs/contributors).

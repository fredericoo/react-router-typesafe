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

### Utilities

The `makeLoader` and `makeAction` utils replace the need for the `satisfies` keyword without adding any runtime overhead.

```tsx
import { makeLoader, makeAction } from 'react-router-typesafe';

const loader = makeLoader(() => ({ message: 'Hello World' }));

const action = makeAction(() => ({ ok: true }));
```

## Contributing

Feel free to improve the code and submit a pull request. If you're not sure about something, create an issue first to discuss it.

## Patched functions

| Status | Utility              | Before     | After                                                        |
| ------ | -------------------- | ---------- | ------------------------------------------------------------ |
| ✅     | `defer`              | `Response` | Generic matching the first argument                          |
| ✅     | `useLoaderData`      | `unknown`  | Generic function with the type of the loader function passed |
| ✅     | `useActionData`      | `unknown`  | Generic function with the type of the action function passed |
| ✅     | `useRouteLoaderData` | `unknown`  | Generic function with the type of the loader function passed |

## About

React Router is developed and maintained by [Remix Software](https://remix.run) and many [amazing contributors](https://github.com/remix-run/react-router/graphs/contributors).

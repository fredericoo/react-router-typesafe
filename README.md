# React Router Typesafe

React Router Typesafe builds upon [react-router](https://github.com/remix-run/react-router) to add type-safety via the use of generics. It brings type functionality closer to Remix, the full-stack framework from the same authors.

## Contributing

Feel free to improve the code and submit a pull request. If you're not sure about something, create an issue first to discuss it.

## Patched utilities

| Status | Utility              | Before     | After                                                 |
| ------ | -------------------- | ---------- | ----------------------------------------------------- |
| ✅     | `defer`              | `Response` | Generic matching the first argument                   |
| ✅     | `useLoaderData`      | `unknown`  | Generic function with the type of the loader function |
| ✅     | `useActionData`      | `unknown`  | Generic function with the type of the action function |
|        | `useRouteLoaderData` | `unknown`  |                                                       |

## About

React Router is developed and maintained by [Remix Software](https://remix.run) and many [amazing contributors](https://github.com/remix-run/react-router/graphs/contributors).

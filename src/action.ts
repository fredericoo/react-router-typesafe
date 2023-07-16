import { ActionFunction, useActionData as rrUseActionData } from 'react-router-dom';

export type ActionData<TActionFn extends ActionFunction> = Awaited<ReturnType<TActionFn>> | undefined;

/** Returns the action data for the nearest ancestor Route action
 * @example
 * const data = useActionData<typeof action>();
 */
export const useActionData = rrUseActionData as <TActionFn extends ActionFunction>() => ActionData<TActionFn>;

import type { ActionFunction, LoaderFunction } from 'react-router-dom';

export const makeLoader = <TLoaderFn extends LoaderFunction>(loaderFn: TLoaderFn) => {
	return loaderFn;
};

export const makeAction = <TActionFn extends ActionFunction>(actionFn: TActionFn) => {
	return actionFn;
};

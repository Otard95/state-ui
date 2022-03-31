import { Component, HTMLElement, State } from '@state-ui/core/lib/types';
export interface RouteCompArgs {
    query: Record<string, string>;
    params: Record<string, string>;
    [key: string]: unknown;
}
export declare type Routes = Record<string, Component<RouteCompArgs>>;
declare const createHashRouter: (routes: Routes, notFound?: HTMLElement) => [HTMLElement, State<string>];
export default createHashRouter;

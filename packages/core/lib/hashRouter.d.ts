import { HTMLElement, State } from "./types";
export interface RouteCompArgs {
    query: Record<string, string>;
    params: Record<string, string>;
}
declare type RouteComp = HTMLElement | ((args: RouteCompArgs) => HTMLElement);
declare type Routes = Record<string, RouteComp>;
declare const createHashRouter: (routes: Routes, notFound?: HTMLElement) => [HTMLElement, State<string>];
export default createHashRouter;

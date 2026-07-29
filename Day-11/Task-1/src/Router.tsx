import { createRootRoute, createRoute, createRouter, Link, Outlet } from "@tanstack/react-router";
import Home from "./Components/Home";
import UseStateFunction from "./Components/UsestateFunction";
import UseEffect from "./Components/UseEffectFunction";
import Useref from "./Components/UseRef";

const rootRouter = createRootRoute({
  component: () => {
    return (
      <>
      <Link to="/">Home</Link>
    <Link to="/usestate">UseState</Link>
    <Link to="/useEffect">UseEffect</Link>
    <Link to="/useRef">UseRef</Link>
        <Outlet />
      </>
    );
  },
});

const home = createRoute({
  getParentRoute: () => rootRouter,
  path: "/",
  component: Home,
});

const useStateRoot = createRoute({
  getParentRoute: () => rootRouter,
  path: "/usestate",
  component: UseStateFunction,
});

const useEfectRoot = createRoute({
  getParentRoute: () => rootRouter,
  path: "/useEffect",
  component: UseEffect,
});
const useRef=createRoute({
  getParentRoute:()=>rootRouter,
  path:"/useRef",
  component:Useref,
})

const routeTree = rootRouter.addChildren([home, useStateRoot, useEfectRoot,useRef]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
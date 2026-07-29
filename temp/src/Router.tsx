import Home from "./Component/Home";
import About from "./Component/About";
import Profile from "./Component/Profile";
import { createRootRoute, createRoute, createRouter, Link, Outlet } from "@tanstack/react-router";


const rootRouter=createRootRoute({
    component:()=>(
        <>
        <Link to={"/"}>Home</Link>
        <Link to={"/about"}>About</Link>
        <Link to={"/Profile"}>Profile</Link>
        <Outlet></Outlet>
        </>
    ),
})
const home=createRoute({
    getParentRoute:()=>rootRouter,
    path:"/",
    component:Home,
});
const about=createRoute({
    getParentRoute:()=>rootRouter,
    path:"/about",
    component:About,
});
const profile=createRoute({
    getParentRoute:()=>rootRouter,
    path:"/profile",
    component:Profile,
});
const routeTree=rootRouter.addChildren([
    home,
    about,
    profile,
]);
export const router=createRouter({
    routeTree,
})
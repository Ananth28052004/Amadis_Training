import {createRootRoute,createRoute,createRouter,Outlet,} from "@tanstack/react-router";
import { RecipeListPage } from "@/pages/RecipeListPage";
import { RecipeDetailPage } from "@/pages/RecipeDetailPage";
import { RecipeFormPage } from "@/pages/RecipeFormPage";
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: RecipeListPage,
});
const newRecipeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipe/new",
  component: () => <RecipeFormPage />,
});
const recipeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipe/$recipeId",
  component: () => {
    const { recipeId } = recipeDetailRoute.useParams();
    return <RecipeDetailPage recipeId={recipeId} />;
  },
});
const editRecipeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipe/$recipeId/edit",
  component: () => {
    const { recipeId } = editRecipeRoute.useParams();
    return <RecipeFormPage recipeId={recipeId} />;
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  newRecipeRoute,
  recipeDetailRoute,
  editRecipeRoute,
]);

export const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

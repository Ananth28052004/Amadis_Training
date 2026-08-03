import { Link } from "@tanstack/react-router";
import { useRecipes } from "@/hooks/useRecipes";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Plus, UtensilsCrossed } from "lucide-react";

export function RecipeListPage() {
  const { recipes, deleteRecipe } = useRecipes();

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100">
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-orange-300/40 blur-3xl"></div>
      <div className="absolute top-1/3 -right-40 h-[450px] w-[450px] rounded-full bg-yellow-300/40 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-pink-200/30 blur-3xl"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-2 shadow-lg border border-white mb-5">
               <UtensilsCrossed className="h-4 w-4 text-orange-500" /> {/*icon */}
              <span className="text-sm font-semibold text-orange-600 hover:bg-red-50">
                One Meal • Every Diet</span>
          </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
              Recipe Remix Board
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-600 leading-8">
              Pick your favorite recipe, choose dietary restrictions like
              <span className="font-semibold text-orange-600"> Vegan</span> or
              <span className="font-semibold text-orange-600"> Gluten-Free</span>
              , and instantly see smart ingredient substitutions.
            </p>
          </div>

          <Link to="/recipe/new">
            <Button className=" h-17 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-6 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <Plus className="mr-2 h-5 w-5" />   {/*icon*/}
              New Recipe
            </Button>
          </Link>
        </div>
        {recipes.length === 0 ? (
          <div className="rounded-3xl bg-white/80 backdrop-blur-lg p-12 shadow-2xl border border-white text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
              <UtensilsCrossed className="h-10 w-10 text-orange-500" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-800">
              No Recipes Yet
            </h2>

            <p className="mt-3 text-gray-500">
              Start by creating your first delicious recipe.
            </p>

            <Link to="/recipe/new">
              <Button className="mt-8 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 px-8 py-6 hover:scale-105 transition-all">
                <Plus className="mr-2 h-5 w-5" />
                Add Recipe
              </Button>
            </Link>
          </div>
        ) :
        (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
              >
                <RecipeCard recipe={recipe} onDelete={deleteRecipe} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

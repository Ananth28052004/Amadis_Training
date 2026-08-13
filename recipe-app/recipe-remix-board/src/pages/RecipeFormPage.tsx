import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChefHat } from "lucide-react";
import { useRecipes } from "@/hooks/useRecipes";
import { RecipeForm } from "@/components/RecipeForm";
import { Recipe } from "@/types";

export function RecipeFormPage({recipeId}:{recipeId?:string;}) {
  const { getRecipe, addRecipe, updateRecipe } = useRecipes();
  const navigate = useNavigate();
  const existing = recipeId?getRecipe(recipeId):undefined;
  function handleSave(recipe: Recipe) {
    if (existing)updateRecipe(existing.id, recipe);
    else addRecipe(recipe);
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <button onClick={() => navigate({ to: "/" })}
          className="group mb-8 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          <span className="text-sm font-medium">All Recipes</span>
        </button>
        <div className="mb-8 rounded-3xl border bg-white/80 p-6 shadow-lg backdrop-blur-lg sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
              <ChefHat className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {existing?`Edit "${existing.name}"`:"Add New Recipe"}
              </h1>
              <p className="mt-2 max-w-2xl text-muted-foreground leading-7">
                {existing?"Update your recipe information below and save the changes.":"Create a delicious recipe by filling out the information below. Add ingredients, instructions, and dietary-friendly substitutions."}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border bg-white/80 p-5 shadow-xl backdrop-blur-lg sm:p-8 lg:p-10">
          <RecipeForm initial={existing}onSave={handleSave}onCancel={() => navigate({ to: "/" })}/>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useRecipes } from "@/hooks/useRecipes";
import { useSubstitutedIngredients } from "@/hooks/useSubstitutedIngredients";
import { DietToggles } from "@/components/DietToggles";
import { IngredientRow } from "@/components/IngredientRow";
import {
  DEFAULT_RESTRICTIONS,
  Recipe,
  Restrictions,
} from "@/types";

export function RecipeDetailPage({recipeId,}: {recipeId: string;}) {
  const { getRecipe } = useRecipes();
  const navigate = useNavigate();
  const recipe = getRecipe(recipeId);
  const [restrictions, setRestrictions] =
    useState<Restrictions>(DEFAULT_RESTRICTIONS);

  useEffect(() => {
    setRestrictions(DEFAULT_RESTRICTIONS);
  }, [recipeId]);

  if (!recipe) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">
            Recipe Not Found
          </h2>

          <p className="text-muted-foreground mb-6">
            This recipe doesn't exist anymore.
          </p>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-white transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <RecipeDetailContent
      recipe={recipe}
      restrictions={restrictions}
      setRestrictions={setRestrictions}
      onBack={() => navigate({ to: "/" })}
    />
  );
}

function RecipeDetailContent({recipe,restrictions,setRestrictions,onBack,}:{
  recipe: Recipe;
  restrictions: Restrictions;
  setRestrictions: (r: Restrictions) => void;
  onBack: () => void;
}) {
  const resolvedIngredients =
    useSubstitutedIngredients(recipe, restrictions);
  const changedCount = resolvedIngredients.filter((i) => i.changed).length;
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="group mb-6 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          <span className="text-sm font-medium">
            All Recipes
          </span>
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"><div>
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img src={recipe.imageUrl}alt={recipe.name}
                className="
                w-full
                object-cover
                h-64
                sm:h-80
                md:h-[420px]
                transition
                duration-700
                hover:scale-105
              "
              />
            </div>
            <div className="mt-6">

              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                {recipe.name}
              </h1>

              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                {recipe.description}
              </p>

            </div>
            <div className="mt-8 rounded-3xl border bg-white/80 backdrop-blur-lg p-6 shadow-lg">
              <h2 className="mb-5 text-lg font-semibold">
                Dietary Restrictions
              </h2>
              <DietToggles
                restrictions={restrictions}
                onChange={setRestrictions}/>
            </div>

          </div>
          <div>

            <div className="sticky top-6">

              <div className="rounded-3xl border bg-white/80 backdrop-blur-lg shadow-lg">

                <div className="flex items-center justify-between border-b px-6 py-5">

                  <h2 className="text-lg font-semibold">
                    Ingredients
                  </h2>

                  {changedCount > 0 && (
                    <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

                      <Sparkles className="h-4 w-4" />

                      {changedCount} substitution
                      {changedCount > 1 ? "s" : ""}

                    </div>
                  )}
                </div>

                <ul className="max-h-[70vh] overflow-y-auto p-4 space-y-2">

                  {resolvedIngredients.map((ingredient) => (
                    <IngredientRow
                      key={ingredient.id}
                      ingredient={ingredient}
                    />
                  ))}

                </ul>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
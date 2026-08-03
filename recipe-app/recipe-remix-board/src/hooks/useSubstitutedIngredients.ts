import { useMemo } from "react";
import { DIET_ORDER, Recipe, Restrictions, ResolvedIngredient } from "@/types";
export function useSubstitutedIngredients(
  recipe: Recipe,
  restrictions: Restrictions
): ResolvedIngredient[] {
  return useMemo(() => {
    const activeDiets = DIET_ORDER.filter((diet) => restrictions[diet]);

    return recipe.ingredients.map((ingredient): ResolvedIngredient => {
      const matchedDiet = activeDiets.find((diet) => ingredient.subs?.[diet]);

      if (!matchedDiet) {
        return {
          id: ingredient.id,
          quantity: ingredient.quantity,
          displayName: ingredient.name,
          originalName: ingredient.name,
          changed: false,
          significant: false,
        };
      }

      const sub = ingredient.subs![matchedDiet]!;
      return {
        id: ingredient.id,
        quantity: ingredient.quantity,
        displayName: sub.name,
        originalName: ingredient.name,
        changed: true,
        significant: sub.significant,
        note: sub.note,
        appliedFor: matchedDiet,
      };
    });
  }, [recipe.id, restrictions.vegan, restrictions.glutenFree, restrictions.dairyFree]);
}

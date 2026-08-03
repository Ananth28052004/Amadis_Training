// The dietary restrictions our app supports.
// Adding a new diet later = add it here + add subs for it on ingredients.
export type DietTag = "vegan" | "glutenFree" | "dairyFree";

// Which restrictions are currently switched on. Always has all 3 keys
// so we never have to check "is this key present" anywhere else.
export type Restrictions = Record<DietTag, boolean>;

export const DEFAULT_RESTRICTIONS: Restrictions = {
  vegan: false,
  glutenFree: false,
  dairyFree: false,
};

// Order matters: if an ingredient has substitution rules for two
// active diets at once, the first one in this list wins.
export const DIET_ORDER: DietTag[] = ["vegan", "glutenFree", "dairyFree"];

export const DIET_LABELS: Record<DietTag, string> = {
  vegan: "Vegan",
  glutenFree: "Gluten-Free",
  dairyFree: "Dairy-Free",
};

// A substitution rule: what to swap an ingredient for under one specific diet.
export interface Substitution {
  name: string; // the replacement ingredient name
  significant: boolean; // true = flavor/texture noticeably changes
  note?: string; // shown next to the warning icon
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  // Optional substitution per diet. Not every ingredient needs an
  // entry for every diet - e.g. "salt" has none, it's fine everywhere.
  subs?: Partial<Record<DietTag, Substitution>>;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: Ingredient[];
}

// The shape returned after we run the substitution logic on a recipe -
// this is what the UI actually renders, one row per ingredient.
export interface ResolvedIngredient {
  id: string;
  quantity: string;
  displayName: string; // substituted name, or original name if unchanged
  originalName: string;
  changed: boolean; // true if a substitution was applied
  significant: boolean; // true if the swap changes flavor/texture a lot
  note?: string;
  appliedFor?: DietTag; // which restriction triggered the swap
}

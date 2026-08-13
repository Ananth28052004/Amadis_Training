export type DietTag = "vegan" | "glutenFree" | "dairyFree";
export type Restrictions = Record<DietTag, boolean>;
export const DEFAULT_RESTRICTIONS: Restrictions = {
  vegan: false,
  glutenFree: false,
  dairyFree: false,
};
export const DIET_ORDER: DietTag[] = ["vegan", "glutenFree", "dairyFree"];
export const DIET_LABELS: Record<DietTag, string> = {
  vegan: "Vegan",
  glutenFree: "Gluten-Free",
  dairyFree: "Dairy-Free",
};
export interface Substitution {
  name: string;
  significant: boolean;
  note?: string;
}
export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  subs?: Partial<Record<DietTag, Substitution>>;
}
export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: Ingredient[];
}
export interface ResolvedIngredient {
  id: string;
  quantity: string;
  displayName: string; 
  originalName: string;
  changed: boolean;
  significant: boolean; 
  note?: string;
  appliedFor?: DietTag; 
}

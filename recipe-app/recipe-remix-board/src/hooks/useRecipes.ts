import { useLocalStorage } from "@/hooks/useLocalStorage";
import { seedRecipes } from "@/data/seedRecipes";
import { Recipe } from "@/types";

const STORAGE_KEY = "recipe-remix-board:recipes";

// One hook = all 4 CRUD operations, all backed by localStorage.
// Every component that calls useRecipes() shares the same localStorage
// key, so an edit made on one page is visible everywhere else too.
export function useRecipes() {
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>(STORAGE_KEY, seedRecipes);

  function addRecipe(recipe: Recipe) {
    setRecipes((prev) => [...prev, recipe]);
  }

  function updateRecipe(id: string, updated: Partial<Recipe>) {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
    );
  }

  function deleteRecipe(id: string) {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }

  function getRecipe(id: string) {
    return recipes.find((r) => r.id === id);
  }

  return { recipes, addRecipe, updateRecipe, deleteRecipe, getRecipe };
}

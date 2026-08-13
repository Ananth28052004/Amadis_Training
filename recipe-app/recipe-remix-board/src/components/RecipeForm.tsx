import { useState } from "react";
import { Recipe, Ingredient, DietTag } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
interface Props{
  initial?: Recipe;
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
}
const VALID_DIETS: DietTag[] = ["vegan", "glutenFree", "dairyFree"];
function parseIngredients(text: string): Ingredient[] {
  return text.split("\n").map((line) => line.trim()).filter(Boolean).map((line, index) => {
      const parts = line.split("|").map((part) => part.trim());
      const [quantity, name, subPart, note] = parts;
      const ingredient: Ingredient = {
        id: `custom-${Date.now()}-${index}`,
        quantity: quantity || "",
        name: name || quantity || line,
      };
      if (subPart) {
        const [dietRaw, subName, significantRaw] = subPart.split(":").map((p) => p.trim());
        const diet = dietRaw as DietTag;
        if (VALID_DIETS.includes(diet) && subName) {
          ingredient.subs = {
            [diet]: {name: subName,significant: significantRaw?.toLowerCase() === "yes",note: note || undefined,},
          };
        }
      }
      return ingredient;
    });
}
function ingredientsToText(ingredients: Ingredient[]): string {
  return ingredients.map((i) => {
      let line = `${i.quantity} | ${i.name}`;
      if (i.subs) {
        const [diet, sub] = Object.entries(i.subs)[0] ?? [];
        if (diet && sub) {
          line += ` | ${diet}:${sub.name}:${sub.significant ? "yes" : "no"}`;
          if (sub.note) line += ` | ${sub.note}`;
        }
      }
      return line;
    })
    .join("\n");
}

export function RecipeForm({ initial, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [ingredientsText, setIngredientsText] = useState(
    initial ? ingredientsToText(initial.ingredients) : "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const recipe: Recipe = {
      id: initial?.id ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: name.trim(),
      description: description.trim(),
      imageUrl:imageUrl.trim(),
      ingredients: parseIngredients(ingredientsText),
    };
    onSave(recipe);
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl">
      <div>
        <label className="text-sm font-medium block mb-1">Recipe name</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Description</label>
        <Textarea rows={2}value={description}onChange={(e) => setDescription(e.target.value)}/>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Image URL</label>
        <Input value={imageUrl}onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."/>
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">
          Ingredients - one per line: "quantity | name" (add substitutions
          with "| diet:substitute name:yes-or-no | optional note")
        </label>
        <Textarea rows={10} value={ingredientsText}onChange={(e) => setIngredientsText(e.target.value)}
          placeholder={
            "400g | Spaghetti\n" +
            "2 | Large eggs | vegan:Scrambled tofu:yes | Softer, milder flavor than egg\n" +
            "2 tbsp | Soy sauce | glutenFree:Tamari:no"
          }
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save recipe</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

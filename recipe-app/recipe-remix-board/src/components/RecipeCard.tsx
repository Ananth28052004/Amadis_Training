import { Link } from "@tanstack/react-router";
import { Recipe } from "@/types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  recipe: Recipe;
  onDelete: (id: string) => void;
}

export function RecipeCard({ recipe, onDelete }: Props) {
  return (
    <Card className="bg-white border border-border overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[0_8px_24px_rgba(60,50,30,0.12)] hover:-translate-y-1 rounded-2xl">
      <Link to="/recipe/$recipeId" params={{ recipeId: recipe.id }} className="block overflow-hidden">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="h-40 sm:h-44 w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      <CardContent className="flex flex-col flex-1 gap-2 p-4 sm:p-5">
        <Link to="/recipe/$recipeId" params={{ recipeId: recipe.id }}>
          <CardTitle className="text-base sm:text-lg font-display leading-snug hover:text-primary transition-colors line-clamp-1">
            {recipe.name}
          </CardTitle>
        </Link>

        <p className="text-sm text-foreground/55 flex-1 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>

        <div className="flex justify-between items-center pt-3 mt-1 border-t border-border/70">
          <span className="text-xs text-foreground/45 font-semibold tracking-wide">
            {recipe.ingredients.length} ingredients
          </span>

          <div className="flex gap-0.5">
            <Link to="/recipe/$recipeId/edit" params={{ recipeId: recipe.id }}>
              <Button
                variant="ghost"
                size="icon"
                title="Edit recipe"
                className="hover:bg-accent/15 hover:text-accent-foreground rounded-lg"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" title="Delete recipe" className="hover:bg-destructive/10 rounded-lg"
              onClick={() => {
                if (confirm(`Delete "${recipe.name}"?`)) onDelete(recipe.id);
              }}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
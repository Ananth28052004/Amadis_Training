import { ResolvedIngredient } from "@/types";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function IngredientRow({ ingredient }: { ingredient: ResolvedIngredient }) {
  return (
    <li
      className={cn(
        "flex items-start justify-between gap-3 py-2.5 px-3 rounded-md transition-colors",
        ingredient.changed
          ? "bg-accent/[0.07] border-l-4 border-accent"
          : "border-l-4 border-transparent"
      )}
    >
      <div className="min-w-0">
        <div className="text-sm">
          <span className="text-foreground/50 tabular-nums">{ingredient.quantity}</span>{" "}
          {ingredient.changed ? (
            <span className="inline-flex items-center gap-1.5 flex-wrap">
              <span className="line-through text-foreground/35">
                {ingredient.originalName}
              </span>
              <ArrowRight className="h-3 w-3 text-accent" />
              <span className="font-semibold text-accent">{ingredient.displayName}</span>
            </span>
          ) : (
            <span className="font-medium">{ingredient.displayName}</span>
          )}
        </div>
        {ingredient.changed && ingredient.significant && (
          <div className="mt-1.5 flex items-start gap-1.5 text-xs text-warning-foreground bg-warning/15 rounded px-2 py-1">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-warning" />
            <span>{ingredient.note ?? "This swap noticeably changes flavor or texture."}</span>
          </div>
        )}
      </div>

      {ingredient.changed && (
        <Badge variant={ingredient.significant ? "warning" : "accent"} className="shrink-0">
          {ingredient.significant ? "Big change" : "Swapped"}
        </Badge>
      )}
    </li>
  );
}

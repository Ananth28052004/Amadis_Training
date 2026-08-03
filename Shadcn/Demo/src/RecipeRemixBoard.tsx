import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, Repeat } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Restriction = "vegan" | "gluten-free" | "dairy-free" | "nut-free";

const RESTRICTIONS: { id: Restriction; label: string }[] = [
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-free" },
  { id: "dairy-free", label: "Dairy-free" },
  { id: "nut-free", label: "Nut-free" },
];

// Priority order used when more than one active restriction could touch the
// same ingredient. First match in this order wins.
const RESTRICTION_PRIORITY: Restriction[] = [
  "vegan",
  "gluten-free",
  "dairy-free",
  "nut-free",
];

interface SubstitutionRule {
  restriction: Restriction;
  replacementName: string;
  /** Only set if the swapped-in amount differs from the original. */
  replacementAmount?: string;
  /** True if the swap meaningfully changes flavor or texture. */
  significant?: boolean;
  /** Short explanation shown in the warning tooltip. */
  note?: string;
}

interface RecipeIngredient {
  id: string;
  name: string;
  amount: string;
  substitutions?: SubstitutionRule[];
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  servings: number;
  prepTime: string;
  ingredients: RecipeIngredient[];
  steps: string[];
}

interface DisplayIngredient {
  id: string;
  originalName: string;
  originalAmount: string;
  displayName: string;
  displayAmount: string;
  substituted: boolean;
  appliedRestriction?: Restriction;
  significant: boolean;
  note?: string;
}

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const RECIPES: Recipe[] = [
  {
    id: "mushroom-risotto",
    title: "Creamy Mushroom Risotto",
    description: "Slow-stirred arborio rice with parmesan and thyme.",
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=1200&auto=format&fit=crop",
    servings: 4,
    prepTime: "45 min",
    ingredients: [
      { id: "r-rice", name: "Arborio rice", amount: "1.5 cups" },
      {
        id: "r-butter",
        name: "Butter",
        amount: "3 tbsp",
        substitutions: [
          { restriction: "vegan", replacementName: "Vegan butter", significant: false },
          {
            restriction: "dairy-free",
            replacementName: "Olive oil",
            replacementAmount: "2 tbsp",
            significant: true,
            note: "Loses the rounded, buttery finish risotto is known for.",
          },
        ],
      },
      {
        id: "r-parmesan",
        name: "Parmesan, grated",
        amount: "1/2 cup",
        substitutions: [
          {
            restriction: "vegan",
            replacementName: "Nutritional yeast",
            replacementAmount: "3 tbsp",
            significant: true,
            note: "Adds a savory, cheesy note but not the same sharp umami as aged parmesan.",
          },
          {
            restriction: "dairy-free",
            replacementName: "Dairy-free parmesan alternative",
            significant: true,
            note: "Melts and browns differently than real parmesan.",
          },
        ],
      },
      {
        id: "r-broth",
        name: "Chicken broth",
        amount: "4 cups",
        substitutions: [
          { restriction: "vegan", replacementName: "Vegetable broth", significant: false },
        ],
      },
      { id: "r-onion", name: "Yellow onion, diced", amount: "1 small" },
      { id: "r-wine", name: "Dry white wine", amount: "1/2 cup" },
      { id: "r-thyme", name: "Fresh thyme", amount: "1 tsp" },
    ],
    steps: [
      "Warm the broth and keep it at a low simmer.",
      "Sauté onion in butter until translucent.",
      "Add rice, toast 1-2 minutes, then deglaze with wine.",
      "Add warm broth a ladle at a time, stirring until absorbed.",
      "Finish with parmesan and thyme.",
    ],
  },
  {
    id: "spaghetti-carbonara",
    title: "Spaghetti Carbonara",
    description: "Eggs, pecorino, and crisped pancetta tossed with hot pasta.",
    image:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=1200&auto=format&fit=crop",
    servings: 4,
    prepTime: "25 min",
    ingredients: [
      {
        id: "c-spaghetti",
        name: "Spaghetti",
        amount: "400 g",
        substitutions: [
          {
            restriction: "gluten-free",
            replacementName: "Gluten-free spaghetti",
            significant: false,
          },
        ],
      },
      {
        id: "c-pancetta",
        name: "Pancetta, diced",
        amount: "150 g",
        substitutions: [
          {
            restriction: "vegan",
            replacementName: "Smoked tempeh, diced",
            significant: true,
            note: "Adds smokiness but not the same rendered fat that coats the noodles.",
          },
        ],
      },
      {
        id: "c-eggs",
        name: "Large eggs",
        amount: "4",
        substitutions: [
          {
            restriction: "vegan",
            replacementName: "Silken tofu + turmeric blend",
            replacementAmount: "1 cup, blended",
            significant: true,
            note: "Mimics the color and creaminess of egg but changes the sauce's silkiness noticeably.",
          },
        ],
      },
      {
        id: "c-pecorino",
        name: "Pecorino Romano, grated",
        amount: "1 cup",
        substitutions: [
          {
            restriction: "vegan",
            replacementName: "Cashew parmesan",
            significant: true,
            note: "Milder and less salty than aged pecorino.",
          },
          {
            restriction: "dairy-free",
            replacementName: "Dairy-free hard cheese alternative",
            significant: true,
          },
          {
            restriction: "nut-free",
            replacementName: "Nutritional yeast blend",
            significant: false,
          },
        ],
      },
      { id: "c-pepper", name: "Black pepper, cracked", amount: "1 tsp" },
    ],
    steps: [
      "Boil spaghetti in salted water until al dente.",
      "Render pancetta in a cold pan until crisp.",
      "Whisk eggs and cheese together off heat.",
      "Toss hot pasta with pancetta, then off-heat with the egg mixture.",
      "Finish with cracked pepper.",
    ],
  },
  {
    id: "pad-thai",
    title: "Pad Thai",
    description: "Stir-fried rice noodles with peanuts, egg, and tamarind.",
    image:
      "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=1200&auto=format&fit=crop",
    servings: 3,
    prepTime: "30 min",
    ingredients: [
      { id: "p-noodles", name: "Flat rice noodles", amount: "250 g" },
      {
        id: "p-shrimp",
        name: "Shrimp, peeled",
        amount: "200 g",
        substitutions: [
          {
            restriction: "vegan",
            replacementName: "Extra-firm tofu, cubed",
            significant: true,
            note: "Firmer bite and no shellfish sweetness, but takes on sauce well.",
          },
        ],
      },
      {
        id: "p-egg",
        name: "Egg",
        amount: "2",
        substitutions: [
          {
            restriction: "vegan",
            replacementName: "Mung bean scramble",
            replacementAmount: "1/3 cup",
            significant: true,
            note: "Close in texture but noticeably milder flavor than egg.",
          },
        ],
      },
      {
        id: "p-fish-sauce",
        name: "Fish sauce",
        amount: "3 tbsp",
        substitutions: [
          {
            restriction: "vegan",
            replacementName: "Soy sauce + tamarind mix",
            significant: true,
            note: "Loses the deep umami fish sauce brings; sauce will taste flatter.",
          },
        ],
      },
      {
        id: "p-peanuts",
        name: "Crushed peanuts",
        amount: "1/3 cup",
        substitutions: [
          {
            restriction: "nut-free",
            replacementName: "Toasted sunflower seeds, crushed",
            significant: false,
          },
        ],
      },
      { id: "p-tamarind", name: "Tamarind paste", amount: "2 tbsp" },
      { id: "p-beansprouts", name: "Bean sprouts", amount: "1 cup" },
    ],
    steps: [
      "Soak rice noodles until pliable.",
      "Stir-fry shrimp and egg, then push to the side of the pan.",
      "Add noodles, tamarind, and fish sauce, tossing to coat.",
      "Fold in bean sprouts and half the peanuts.",
      "Top with remaining peanuts before serving.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Substitution engine (pure) + memoized hook
// ---------------------------------------------------------------------------

function computeSubstitutedIngredients(
  recipe: Recipe,
  active: Set<Restriction>
): DisplayIngredient[] {
  return recipe.ingredients.map((ingredient) => {
    let matched: SubstitutionRule | undefined;

    // Walk restrictions in priority order so results are deterministic even
    // if several active restrictions could touch the same ingredient.
    for (const restriction of RESTRICTION_PRIORITY) {
      if (!active.has(restriction)) continue;
      const rule = ingredient.substitutions?.find((s) => s.restriction === restriction);
      if (rule) {
        matched = rule;
        break;
      }
    }

    if (!matched) {
      return {
        id: ingredient.id,
        originalName: ingredient.name,
        originalAmount: ingredient.amount,
        displayName: ingredient.name,
        displayAmount: ingredient.amount,
        substituted: false,
        significant: false,
      };
    }

    return {
      id: ingredient.id,
      originalName: ingredient.name,
      originalAmount: ingredient.amount,
      displayName: matched.replacementName,
      displayAmount: matched.replacementAmount ?? ingredient.amount,
      substituted: true,
      appliedRestriction: matched.restriction,
      significant: !!matched.significant,
      note: matched.note,
    };
  });
}

/** Stable string key for a restriction set, safe to use as a memo dependency. */
function restrictionKey(active: Set<Restriction>): string {
  return Array.from(active).sort().join("|");
}

/**
 * Recomputes the substituted ingredient list only when the recipe identity
 * or the active restriction set actually changes -- not on every render.
 * `active` is turned into a sorted string key so two Sets with the same
 * members don't trigger a needless recompute just because they're different
 * Set instances.
 */
function useSubstitutedIngredients(recipe: Recipe, active: Set<Restriction>) {
  const key = restrictionKey(active);
  return useMemo(
    () => computeSubstitutedIngredients(recipe, active),
    // `key` already captures everything about `active` that matters here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recipe, key]
  );
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function RecipeCard({
  recipe,
  onSelect,
}: {
  recipe: Recipe;
  onSelect: (id: string) => void;
}) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onSelect(recipe.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(recipe.id);
      }}
      className="overflow-hidden border-[#E4DFD3] bg-white cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B6F4F]"
    >
      <div className="aspect-[4/3] overflow-hidden bg-[#EFEAE0]">
        <img src={recipe.image} alt={recipe.title} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-serif text-lg text-[#2B2A28]">{recipe.title}</h3>
        <p className="mt-1 text-sm text-[#6B6656] line-clamp-2">{recipe.description}</p>
        <p className="mt-2 font-mono text-xs text-[#8A8272]">
          {recipe.prepTime} · serves {recipe.servings}
        </p>
      </CardContent>
    </Card>
  );
}

function RecipeList({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-serif text-3xl text-[#2B2A28]">Recipe Remix Board</h1>
      <p className="mt-2 text-[#6B6656]">
        Pick a recipe, then flag the diets you're cooking for. The ingredient list rewrites
        itself on the fly.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {RECIPES.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

function RestrictionToggles({
  active,
  onToggle,
}: {
  active: Set<Restriction>;
  onToggle: (restriction: Restriction, checked: boolean) => void;
}) {
  return (
    <fieldset>
      <legend className="font-serif text-sm tracking-wide text-[#5B6F4F] mb-2">
        Dietary restrictions
      </legend>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {RESTRICTIONS.map(({ id, label }) => (
          <div key={id} className="flex items-center gap-2">
            <Checkbox
              id={`restriction-${id}`}
              checked={active.has(id)}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                onToggle(id, checked === true)
              }
              className="border-[#5B6F4F] data-[state=checked]:bg-[#5B6F4F] data-[state=checked]:border-[#5B6F4F]"
            />
            <Label htmlFor={`restriction-${id}`} className="text-sm text-[#2B2A28] cursor-pointer select-none">
              {label}
            </Label>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

function IngredientList({ ingredients }: { ingredients: DisplayIngredient[] }) {
  return (
    <TooltipProvider>
      <ul className="divide-y divide-[#E4DFD3]">
        {ingredients.map((ing) => (
          <li key={ing.id} className="flex items-start justify-between gap-3 py-2.5">
            <div className="flex items-start gap-2 min-w-0">
              {ing.substituted && (
                <Repeat className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5B6F4F]" aria-hidden="true" />
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={
                      ing.substituted
                        ? "text-[#5B6F4F] font-medium underline decoration-dotted underline-offset-4"
                        : "text-[#2B2A28]"
                    }
                  >
                    {ing.displayName}
                  </span>

                  {ing.substituted && (
                    <span className="text-xs text-[#8A8272] line-through">{ing.originalName}</span>
                  )}

                  {ing.significant && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className="inline-flex items-center text-[#C9772F] cursor-help"
                          aria-label={`Flavor or texture warning for ${ing.displayName}`}
                        >
                          <AlertTriangle className="h-3.5 w-3.5" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[220px] text-xs">
                        {ing.note ?? "This swap noticeably changes flavor or texture."}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>

            <span className="shrink-0 font-mono text-xs text-[#6B6656] pt-0.5">
              {ing.displayAmount}
            </span>
          </li>
        ))}
      </ul>
    </TooltipProvider>
  );
}

/**
 * NOTE on restriction reset: this component is mounted with `key={recipe.id}`
 * by its parent (RecipeRemixBoard below). React tears down and recreates
 * this component's state whenever the recipe changes, so `restrictions`
 * always starts empty for a newly opened recipe -- no stale checkboxes
 * carried over from the last one, no manual reset effect needed.
 */
function RecipeDetail({ recipe, onBack }: { recipe: Recipe; onBack: () => void }) {
  const [restrictions, setRestrictions] = useState<Set<Restriction>>(() => new Set());
  const ingredients = useSubstitutedIngredients(recipe, restrictions);

  function handleToggle(restriction: Restriction, checked: boolean) {
    setRestrictions((prev) => {
      const next = new Set(prev);
      if (checked) next.add(restriction);
      else next.delete(restriction);
      return next;
    });
  }

  const changedCount = ingredients.filter((i) => i.substituted).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 -ml-2 text-[#6B6656] hover:text-[#2B2A28] hover:bg-[#EFEAE0]"
      >
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        All recipes
      </Button>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Image column: stacks above ingredients on mobile, sits side-by-side on desktop */}
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[#EFEAE0] md:sticky md:top-8">
            <img src={recipe.image} alt={recipe.title} className="h-full w-full object-cover" />
          </div>

          <h2 className="mt-4 font-serif text-2xl text-[#2B2A28]">{recipe.title}</h2>
          <p className="mt-1 text-sm text-[#6B6656]">{recipe.description}</p>
          <p className="mt-2 font-mono text-xs text-[#8A8272]">
            {recipe.prepTime} · serves {recipe.servings}
          </p>

          <div className="mt-6">
            <h3 className="font-serif text-lg text-[#2B2A28] mb-2">Steps</h3>
            <ol className="list-decimal list-inside space-y-1.5 text-sm text-[#4A463D]">
              {recipe.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Ingredients column */}
        <div>
          <RestrictionToggles active={restrictions} onToggle={handleToggle} />

          <Separator className="my-5 bg-[#E4DFD3]" />

          <div className="flex items-baseline justify-between">
            <h3 className="font-serif text-lg text-[#2B2A28]">Ingredients</h3>
            {changedCount > 0 && (
              <span className="text-xs text-[#5B6F4F]">
                {changedCount} swap{changedCount > 1 ? "s" : ""} applied
              </span>
            )}
          </div>

          <IngredientList ingredients={ingredients} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root component (default export)
// ---------------------------------------------------------------------------

export default function RecipeRemixBoard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedRecipe = RECIPES.find((r) => r.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-[#F7F3EC] font-sans text-[#2B2A28]">
      {selectedRecipe ? (
        // `key` forces React to unmount/remount RecipeDetail when the recipe
        // changes, which resets its internal restriction state automatically.
        <RecipeDetail
          key={selectedRecipe.id}
          recipe={selectedRecipe}
          onBack={() => setSelectedId(null)}
        />
      ) : (
        <RecipeList onSelect={setSelectedId} />
      )}
    </div>
  );
}
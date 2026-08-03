# Recipe Remix Board

## Run it
```bash
npm install
npm run dev
```
Open the printed localhost URL. Data is stored in your browser's
localStorage, so it persists across refreshes but is per-browser.

## How the pieces fit together

**Routing (`src/router.tsx`)** - TanStack Router, defined in code (no
file-based codegen, easier to read top-to-bottom as a beginner):
- `/` - browse recipes
- `/recipe/new` - create form
- `/recipe/$recipeId` - detail page (diet toggles + ingredient list)
- `/recipe/$recipeId/edit` - edit form

**Data / CRUD (`src/hooks/useLocalStorage.ts` + `useRecipes.ts`)**
`useLocalStorage` is a generic `useState` that also mirrors its value
into `localStorage`. `useRecipes` builds all 4 CRUD operations
(add/update/delete/get) on top of it, seeded from `src/data/seedRecipes.ts`
on first run. Every page calls the same `useRecipes()` hook, so edits
made on one page show up everywhere else automatically.

**The substitution engine (`src/hooks/useSubstitutedIngredients.ts`)**
This is the core of the "remix" logic. Each ingredient can carry a
`subs` map like:
```ts
{ vegan: { name: "Flax egg", significant: true, note: "..." } }
```
Given the recipe and the currently-checked restrictions, the hook
walks the ingredient list once and, for each one, finds the
highest-priority active diet that has a substitution rule for it
(priority order: vegan > glutenFree > dairyFree, so you get a
predictable result if two diets could both apply). It returns a flat
list the UI just renders - no logic lives in the components themselves.

It's wrapped in `useMemo` with `[recipe.id, restrictions.vegan,
restrictions.glutenFree, restrictions.dairyFree]` as dependencies.
That means: ticking a checkbox anywhere else in the app, or any other
re-render caused by unrelated state, does NOT re-run this calculation -
only an actual recipe or restriction change does. This satisfies the
"don't redo the whole calculation unless something actually changed"
requirement directly, rather than through manual caching.

**Instant updates, no submit button (`src/pages/RecipeDetailPage.tsx`)**
`restrictions` lives in `useState` on the detail page. Checking a box
calls `setRestrictions` synchronously, which re-renders the page and
re-runs the memoized hook above - all in the same render cycle. There's
no separate "apply" step to wire up.

**Resetting restrictions on recipe switch**
```ts
useEffect(() => {
  setRestrictions(DEFAULT_RESTRICTIONS);
}, [recipeId]);
```
Whenever the `$recipeId` route param changes, this effect fires and
resets the checkboxes back to unchecked - so restrictions never leak
from one recipe to the next.

**Visual marking of substitutions (`src/components/IngredientRow.tsx`)**
Changed ingredients get a tinted background + colored left border and
show `original name → new name` with an arrow icon. A small yellow
warning (with the specific note, e.g. "sauce will be thicker") only
renders on the individual row where `significant: true` - it's scoped
to that one `<li>`, never to the whole ingredient list.

**Responsive layout (`RecipeDetailPage.tsx`)**
```html
<div className="flex flex-col md:flex-row gap-6">
```
Below Tailwind's `md` breakpoint (768px) this is a column (image on
top, ingredients below). At `md` and above it becomes a row, so the
image and ingredient list sit side-by-side on desktop.

## Extending it
- Add a new diet: add it to `DietTag` and `DIET_ORDER`/`DIET_LABELS` in
  `src/types.ts`, then add `subs.yourDiet` entries on ingredients.
- User-created recipes (via the "New recipe" form) start with no
  pre-built substitution rules, since there's no database to look them
  up against - they'll just show the original ingredients. A real
  product would hook the form up to a substitution-rules API here.

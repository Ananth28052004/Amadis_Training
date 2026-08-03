import { Recipe } from "@/types";

// This is the "starter" data. On first load, useRecipes() copies this
// into localStorage. After that, localStorage is the source of truth,
// so edits/deletes persist between visits.
export const seedRecipes: Recipe[] = [
  {
    id: "spaghetti-carbonara",
    name: "Spaghetti Carbonara",
    description: "Classic Roman pasta with eggs, cheese, and pancetta.",
    imageUrl:
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&auto=format&fit=crop",
    ingredients: [
      { id: "i1", quantity: "400g", name: "Spaghetti",
        subs: { glutenFree: { name: "Gluten-free spaghetti", significant: false, note: "Cook 1-2 min less to avoid mushiness" } } },
      { id: "i2", quantity: "150g", name: "Pancetta",
        subs: { vegan: { name: "Smoky tempeh bits", significant: true, note: "Loses the rendered-fat richness pancetta gives the sauce" } } },
      { id: "i3", quantity: "3", name: "Large eggs",
        subs: { vegan: { name: "Silken tofu + chickpea flour blend", significant: true, note: "The sauce will be thicker and less silky" } } },
      { id: "i4", quantity: "100g", name: "Pecorino cheese",
        subs: { vegan: { name: "Nutritional yeast", significant: true, note: "Milder, less salty/sharp than pecorino" }, dairyFree: { name: "Nutritional yeast", significant: true, note: "Milder, less salty/sharp than pecorino" } } },
      { id: "i5", quantity: "2 tsp", name: "Black pepper" },
      { id: "i6", quantity: "1 tbsp", name: "Olive oil" },
    ],
  },
  {
    id: "chicken-tikka-masala",
    name: "Chicken Tikka Masala",
    description: "Grilled chicken in a creamy spiced tomato sauce.",
    imageUrl:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop",
    ingredients: [
      { id: "i1", quantity: "600g", name: "Chicken thighs",
        subs: { vegan: { name: "Firm tofu or cauliflower florets", significant: true, note: "Different texture, tofu won't shred like chicken" } } },
      { id: "i2", quantity: "200g", name: "Plain yogurt",
        subs: { vegan: { name: "Coconut yogurt", significant: false }, dairyFree: { name: "Coconut yogurt", significant: false } } },
      { id: "i3", quantity: "150ml", name: "Heavy cream",
        subs: { vegan: { name: "Coconut cream", significant: true, note: "Adds a mild coconut flavor to the sauce" }, dairyFree: { name: "Coconut cream", significant: true, note: "Adds a mild coconut flavor to the sauce" } } },
      { id: "i4", quantity: "2 tbsp", name: "Butter",
        subs: { vegan: { name: "Vegan butter / neutral oil", significant: false }, dairyFree: { name: "Vegan butter / neutral oil", significant: false } } },
      { id: "i5", quantity: "400g", name: "Crushed tomatoes" },
      { id: "i6", quantity: "1 tbsp", name: "Garam masala" },
      { id: "i7", quantity: "3 cloves", name: "Garlic" },
    ],
  },
  {
    id: "chocolate-chip-cookies",
    name: "Chocolate Chip Cookies",
    description: "Chewy, buttery classic cookies.",
    imageUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop",
    ingredients: [
      { id: "i1", quantity: "280g", name: "All-purpose flour",
        subs: { glutenFree: { name: "1:1 gluten-free flour blend", significant: true, note: "Cookies may spread more and turn out slightly denser" } } },
      { id: "i2", quantity: "225g", name: "Butter",
        subs: { vegan: { name: "Vegan butter", significant: false }, dairyFree: { name: "Vegan butter", significant: false } } },
      { id: "i3", quantity: "2", name: "Large eggs",
        subs: { vegan: { name: "Flax eggs (1 tbsp ground flax + 3 tbsp water each)", significant: true, note: "Slightly less rise, chewier crumb" } } },
      { id: "i4", quantity: "200g", name: "Chocolate chips",
        subs: { vegan: { name: "Dairy-free chocolate chips", significant: false }, dairyFree: { name: "Dairy-free chocolate chips", significant: false } } },
      { id: "i5", quantity: "150g", name: "Brown sugar" },
      { id: "i6", quantity: "1 tsp", name: "Vanilla extract" },
      { id: "i7", quantity: "1 tsp", name: "Baking soda" },
      { id: "i8", quantity: "1/2 tsp", name: "Salt" },
    ],
  },
];

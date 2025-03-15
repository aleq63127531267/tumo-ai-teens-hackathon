import { NextResponse } from 'next/server';

// Mock recipe generation function
function generateMockRecipes(ingredients: string[]) {
  // Convert all ingredients to lowercase for easier matching
  const lowerIngredients = ingredients.map(ing => ing.toLowerCase());
  
  // Define some recipe templates based on common ingredients
  const recipeTemplates = [
    {
      trigger: ['chicken', 'poultry', 'meat'],
      title: 'Herb Roasted Chicken',
      ingredients: ['Chicken breasts', 'Olive oil', 'Garlic', 'Rosemary', 'Thyme', 'Salt', 'Pepper', 'Lemon'],
      instructions: [
        'Preheat oven to 375°F (190°C).',
        'Place chicken breasts in a baking dish.',
        'Drizzle with olive oil and season with minced garlic, chopped rosemary, thyme, salt, and pepper.',
        'Squeeze lemon juice over the chicken.',
        'Bake for 25-30 minutes until chicken reaches an internal temperature of 165°F (74°C).',
        'Let rest for 5 minutes before serving.'
      ],
      cookTime: '35 minutes',
      servings: 4
    },
    {
      trigger: ['pasta', 'tomato', 'tomatoes'],
      title: 'Classic Pasta Marinara',
      ingredients: ['Pasta', 'Olive oil', 'Garlic', 'Canned tomatoes', 'Basil', 'Salt', 'Pepper', 'Parmesan cheese'],
      instructions: [
        'Cook pasta according to package instructions.',
        'In a large pan, heat olive oil over medium heat.',
        'Add minced garlic and cook until fragrant, about 30 seconds.',
        'Add canned tomatoes, breaking them up with a spoon.',
        'Simmer for 15-20 minutes until sauce thickens.',
        'Season with salt, pepper, and torn basil leaves.',
        'Toss with cooked pasta and serve with grated Parmesan.'
      ],
      cookTime: '25 minutes',
      servings: 4
    },
    {
      trigger: ['rice', 'vegetable', 'vegetables'],
      title: 'Vegetable Fried Rice',
      ingredients: ['Rice', 'Mixed vegetables', 'Eggs', 'Soy sauce', 'Sesame oil', 'Garlic', 'Ginger', 'Green onions'],
      instructions: [
        'Cook rice according to package instructions and let cool.',
        'Heat oil in a large wok or pan over high heat.',
        'Add minced garlic and ginger, stir for 30 seconds.',
        'Add mixed vegetables and stir-fry for 3-4 minutes.',
        'Push everything to one side and scramble eggs on the empty side.',
        'Add cooled rice and mix everything together.',
        'Drizzle with soy sauce and sesame oil, toss to combine.',
        'Garnish with chopped green onions before serving.'
      ],
      cookTime: '20 minutes',
      servings: 4
    },
    {
      trigger: ['potato', 'potatoes', 'cheese'],
      title: 'Cheesy Potato Bake',
      ingredients: ['Potatoes', 'Cheddar cheese', 'Butter', 'Milk', 'Garlic', 'Salt', 'Pepper', 'Chives'],
      instructions: [
        'Preheat oven to 375°F (190°C).',
        'Slice potatoes thinly and layer in a greased baking dish.',
        'In a bowl, mix melted butter, milk, minced garlic, salt, and pepper.',
        'Pour mixture over potatoes.',
        'Cover with foil and bake for 45 minutes.',
        'Remove foil, sprinkle with grated cheddar cheese.',
        'Bake uncovered for another 15 minutes until golden and bubbly.',
        'Garnish with chopped chives before serving.'
      ],
      cookTime: '1 hour',
      servings: 6
    },
    {
      trigger: ['egg', 'eggs', 'spinach'],
      title: 'Spinach and Feta Omelette',
      ingredients: ['Eggs', 'Spinach', 'Feta cheese', 'Olive oil', 'Salt', 'Pepper', 'Red pepper flakes'],
      instructions: [
        'Whisk eggs in a bowl with salt and pepper.',
        'Heat olive oil in a non-stick pan over medium heat.',
        'Add spinach and cook until wilted, about 1 minute.',
        'Pour in egg mixture and cook until edges start to set.',
        'Sprinkle crumbled feta cheese over half the omelette.',
        'Fold omelette in half and cook until eggs are set but still moist.',
        'Sprinkle with red pepper flakes before serving.'
      ],
      cookTime: '10 minutes',
      servings: 1
    }
  ];

  // Find matching recipes based on ingredients
  const matchedRecipes = recipeTemplates.filter(template => 
    template.trigger.some(trigger => 
      lowerIngredients.some(ing => ing.includes(trigger) || trigger.includes(ing))
    )
  );

  // If no matches, return some default recipes
  if (matchedRecipes.length === 0) {
    return recipeTemplates.slice(0, 3);
  }

  // Return up to 3 matched recipes
  return matchedRecipes.slice(0, 3).map((recipe, index) => ({
    ...recipe,
    id: (index + 1).toString(),
    imageUrl: `https://source.unsplash.com/random/800x600/?food,${recipe.title.replace(/\s+/g, '-')}`
  }));
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { ingredients } = body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Invalid ingredients provided' },
        { status: 400 }
      );
    }

    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock recipes
    const recipes = generateMockRecipes(ingredients);

    // Return the generated recipes
    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Error generating recipes:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipes' },
      { status: 500 }
    );
  }
} 
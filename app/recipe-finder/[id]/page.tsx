'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Recipe } from '../types';

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recipeId = params.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  // Sample recipes as fallback
  const sampleRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Simple Pasta with Tomato Sauce',
      ingredients: ['Pasta', 'Tomatoes', 'Garlic', 'Olive Oil', 'Salt', 'Pepper'],
      instructions: [
        'Boil pasta according to package instructions.',
        'In a separate pan, heat olive oil and sauté garlic until fragrant.',
        'Add chopped tomatoes and cook for 10 minutes.',
        'Season with salt and pepper.',
        'Combine sauce with drained pasta and serve.'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
      cookTime: '20 minutes',
      servings: 4
    },
    {
      id: '2',
      title: 'Vegetable Stir Fry',
      ingredients: ['Rice', 'Broccoli', 'Carrots', 'Bell Peppers', 'Garlic', 'Soy Sauce', 'Olive Oil'],
      instructions: [
        'Cook rice according to package instructions.',
        'Heat olive oil in a wok or large pan.',
        'Add garlic and stir for 30 seconds.',
        'Add chopped vegetables and stir fry for 5-7 minutes.',
        'Add soy sauce and continue cooking for 2 minutes.',
        'Serve over rice.'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      cookTime: '25 minutes',
      servings: 3
    },
    {
      id: '3',
      title: 'Scrambled Eggs on Toast',
      ingredients: ['Eggs', 'Milk', 'Butter', 'Salt', 'Pepper', 'Bread'],
      instructions: [
        'Whisk eggs and milk together in a bowl.',
        'Melt butter in a non-stick pan over medium heat.',
        'Pour in egg mixture and stir gently until eggs are set but still moist.',
        'Season with salt and pepper.',
        'Toast bread and serve eggs on top.'
      ],
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80',
      cookTime: '10 minutes',
      servings: 2
    }
  ];

  // Fetch recipe data
  useEffect(() => {
    // Simulate API call
    setLoading(true);

    // Try to get recipe from session storage (for AI-generated recipes)
    const storedRecipes = sessionStorage.getItem('aiGeneratedRecipes');
    if (storedRecipes) {
      try {
        const parsedRecipes = JSON.parse(storedRecipes);
        const foundRecipe = parsedRecipes.find((r: Recipe) => r.id === recipeId);
        
        if (foundRecipe) {
          setRecipe(foundRecipe);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing stored recipes:', error);
      }
    }

    // Fallback to sample recipes
    setTimeout(() => {
      const foundRecipe = sampleRecipes.find(r => r.id === recipeId);
      setRecipe(foundRecipe || null);
      setLoading(false);
    }, 1000);
  }, [recipeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-orange-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-700">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/recipe-finder">
            <button className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-md text-orange-600 hover:bg-orange-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Recipes
            </button>
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13.5h.01M12 17.5h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Recipe Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the recipe you're looking for.</p>
          <Link href="/recipe-finder">
            <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Browse All Recipes
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Navigation */}
      <div className="mb-8">
        <Link href="/recipe-finder">
          <button className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-md text-orange-600 hover:bg-orange-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Recipes
          </button>
        </Link>
      </div>
      
      {/* Recipe Details */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
        {/* Hero Image */}
        <div className="h-64 sm:h-80 md:h-96 relative">
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 sm:p-8 w-full">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{recipe.title}</h1>
              <div className="flex items-center text-white text-sm sm:text-base">
                <div className="flex items-center mr-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{recipe.cookTime}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recipe Content */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ingredients */}
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Ingredients
              </h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex-shrink-0 flex items-center justify-center mr-2 mt-0.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Instructions */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Instructions
              </h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-600 text-white rounded-full font-medium flex-shrink-0 mr-3">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          {/* Share and Print Buttons */}
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Share Recipe
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
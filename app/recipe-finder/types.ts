// Define types for our recipe data
export type Ingredient = {
  id: string;
  name: string;
};

export type Recipe = {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  imageUrl: string;
  cookTime: string;
  servings: number;
}; 
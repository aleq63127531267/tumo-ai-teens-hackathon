import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge for better performance
export const runtime = 'edge';

// Extract ingredients from user message
function extractIngredients(message: string): string[] {
  // Split message into words
  const words = message.split(/\s+|,|;|\./).filter(word => word.length > 2);
  
  // Filter out common words that are not likely to be ingredients
  const commonWords = [
    'have', 'has', 'had', 'the', 'and', 'with', 'for', 'can', 'make', 
    'using', 'use', 'used', 'some', 'few', 'little', 'lot', 'need',
    'want', 'would', 'could', 'should', 'recipe', 'recipes', 'cook',
    'cooking', 'food', 'meal', 'dinner', 'lunch', 'breakfast'
  ];
  
  const potentialIngredients = words.filter(word => 
    !commonWords.includes(word.toLowerCase())
  );
  
  // Format ingredients (capitalize first letter)
  return potentialIngredients.map(ing => 
    ing.charAt(0).toUpperCase() + ing.slice(1).toLowerCase()
  );
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { message, existingIngredients = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message provided' },
        { status: 400 }
      );
    }

    // Extract ingredients from message
    const extractedIngredients = extractIngredients(message);
    
    // Create a system message that explains the assistant's role
    const systemMessage = `You are an AI cooking assistant that helps users find recipes based on ingredients they have.
Your goal is to be helpful, friendly, and concise.
The user has the following ingredients: ${existingIngredients.join(', ')}.
I've also extracted these potential ingredients from their message: ${extractedIngredients.join(', ')}.
Respond in a conversational way, acknowledging any ingredients they mentioned.
If they're asking for recipe suggestions, suggest specific recipes they can make with their ingredients.

IMPORTANT FORMATTING INSTRUCTION: Format your response using bullet points with the "•" symbol.
For recipe suggestions, use this exact format:
• Recipe name: [name of recipe]
• Ingredients: [list key ingredients]
• Instructions: [brief cooking instructions]

Keep your responses under 150 words.`;

    // Request the OpenAI API for the response
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    // Get the response content
    const responseContent = aiResponse.choices[0].message.content || 'I\'m not sure how to respond to that. Could you try asking something about cooking or recipes?';

    // Return the response
    return NextResponse.json({ 
      response: responseContent,
      extractedIngredients
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

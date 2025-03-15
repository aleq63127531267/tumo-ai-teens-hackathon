import OpenAI from 'openai';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();

    // Request the OpenAI API for the response
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful travel advisor. Provide personalized travel destination suggestions based on user preferences. Include details about the destination, budget considerations, and travel tips. Format your response in markdown with clear headings, bullet points, and sections.'
        },
        ...messages
      ],
    });

    // Return the response as JSON
    return Response.json({
      role: 'assistant',
      content: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error in travel suggestions API:', error);
    return Response.json(
      { error: 'There was an error processing your request' },
      { status: 500 }
    );
  }
} 
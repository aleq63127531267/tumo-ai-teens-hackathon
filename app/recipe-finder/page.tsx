'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Ingredient, Recipe } from './types';

// Define chat message type
type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function RecipeFinderPage() {
  // State for user's ingredients
  const [userIngredients, setUserIngredients] = useState<Ingredient[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI cooking assistant. Tell me what ingredients you have, and I\'ll suggest recipes you can make.'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sample ingredients for suggestions
  const sampleIngredients = [
    'Chicken', 'Beef', 'Pork', 'Rice', 'Pasta', 'Tomatoes', 'Onions', 
    'Garlic', 'Potatoes', 'Carrots', 'Broccoli', 'Spinach', 'Eggs', 
    'Milk', 'Cheese', 'Butter', 'Olive Oil', 'Salt', 'Pepper', 'Flour',
    'Sugar', 'Bread', 'Beans', 'Lentils', 'Corn', 'Bell Peppers'
  ];

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Remove an ingredient
  const removeIngredient = (id: string) => {
    setUserIngredients(userIngredients.filter(ingredient => ingredient.id !== id));
  };

  // Helper function to format bullet points in AI responses
  const formatBulletPoints = (text: string) => {
    // Replace markdown bullet points with HTML bullet points
    return text
      // Handle markdown headings
      .replace(/#{1,6}\s+([^\n]+)/g, '<h3 class="text-lg font-bold text-orange-800 my-3">$1</h3>')
      // Handle bullet points with colons
      .replace(/\n\s*•\s+([^:]+):\s*\n/g, '\n<div class="flex flex-col my-2"><div class="flex items-start"><span class="text-orange-600 mr-2">•</span><span class="font-semibold text-orange-700">$1:</span></div>')
      .replace(/\n\s*•\s+([^:]+):/g, '\n<div class="flex items-start my-2"><span class="text-orange-600 mr-2">•</span><span class="font-semibold text-orange-700">$1:</span></div>')
      // Handle regular bullet points
      .replace(/\n\s*-\s+/g, '\n• ')
      .replace(/\n\s*\*\s+/g, '\n• ')
      .replace(/\n\s*•\s+([^:]+)/g, '\n<div class="flex items-start my-2"><span class="text-orange-600 mr-2">•</span><span>$1</span></div>')
      // Close any unclosed divs
      .replace(/(<div[^>]*>)(?![\s\S]*?<\/div>)/g, '$1</div>')
      // Remove any remaining asterisks used for emphasis
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
  };

  // Handle chat input submission
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (chatInput.trim() === '') return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setChatLoading(true);
    
    try {
      // Get existing ingredient names
      const existingIngredientNames = userIngredients.map(ing => ing.name);
      
      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: chatInput,
          existingIngredients: existingIngredientNames
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process chat message');
      }

      const data = await response.json();
      
      // Add extracted ingredients
      if (data.extractedIngredients && data.extractedIngredients.length > 0) {
        const newIngredients: Ingredient[] = [];
        
        data.extractedIngredients.forEach((ing: string) => {
          // Check if ingredient is already added
          if (!userIngredients.some(ui => ui.name.toLowerCase() === ing.toLowerCase())) {
            newIngredients.push({
              id: Date.now().toString() + ing,
              name: ing
            });
          }
        });
        
        if (newIngredients.length > 0) {
          setUserIngredients(prev => [...prev, ...newIngredients]);
        }
      }
      
      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        role: 'assistant',
        content: data.response
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing chat:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        role: 'assistant',
        content: 'Sorry, I had trouble understanding that. Could you try again?'
      };
      
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100">
      {/* Background patterns */}
      <div className="fixed inset-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(251,146,60,0.15),rgba(255,255,255,0))] pointer-events-none"></div>
      <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-orange-100 to-transparent opacity-50 pointer-events-none"></div>
      
      {/* Decorative elements */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      <div className="fixed bottom-20 left-20 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/">
            <button className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-md text-orange-600 hover:bg-orange-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-orange-500 mx-auto animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
            AI Recipe Finder
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chat with our AI assistant about the ingredients you have, and we'll suggest recipes you can make.
          </p>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          {/* Chat Interface */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col h-[600px] border border-orange-100">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4">
              <h2 className="text-xl font-semibold">Chat with AI Chef</h2>
              <p className="text-xs text-orange-100 mt-1">Powered by OpenAI GPT</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('/food-pattern.svg')] bg-opacity-5">
              {chatMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                      message.role === 'user' 
                        ? 'bg-orange-100 text-gray-800' 
                        : 'bg-white text-gray-800 prose prose-orange max-w-none'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div dangerouslySetInnerHTML={{ __html: formatBulletPoints(message.content) }} />
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-orange-100 bg-white">
              <div className="flex">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Tell me what ingredients you have..."
                  className="flex-1 px-4 py-3 border border-orange-200 rounded-l-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent hover:border-orange-300 transition-colors"
                  disabled={chatLoading}
                />
                <button
                  type="submit"
                  className={`px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-r-lg ${
                    chatLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-orange-600 hover:to-amber-600'
                  } transition-colors`}
                  disabled={chatLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
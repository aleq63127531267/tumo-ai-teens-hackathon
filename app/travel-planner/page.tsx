'use client';

import { useState, FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function TravelPlanner() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your AI travel planner. Tell me about your ideal destination - consider mentioning things like:

<ul class="space-y-2 pl-5 my-4">
  <li class="flex items-start">
    <span class="text-emerald-600 mr-2">•</span>
    <span><strong>Climate preferences</strong> (warm, cold, tropical, etc.)</span>
  </li>
  <li class="flex items-start">
    <span class="text-emerald-600 mr-2">•</span>
    <span><strong>Type of activities</strong> (adventure, relaxation, cultural, etc.)</span>
  </li>
  <li class="flex items-start">
    <span class="text-emerald-600 mr-2">•</span>
    <span><strong>Budget range</strong></span>
  </li>
  <li class="flex items-start">
    <span class="text-emerald-600 mr-2">•</span>
    <span><strong>Preferred season</strong></span>
  </li>
  <li class="flex items-start">
    <span class="text-emerald-600 mr-2">•</span>
    <span><strong>Travel duration</strong></span>
  </li>
  <li class="flex items-start">
    <span class="text-emerald-600 mr-2">•</span>
    <span><strong>Special interests</strong> (food, history, nature, etc.)</span>
  </li>
</ul>

I'll suggest some perfect destinations for you!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Send request to API
      const response = await fetch('/api/travel-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage)
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to get travel suggestions');
      }
      
      const data = await response.json();
      
      // Add AI response
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: formatBulletPoints(data.content)
        }
      ]);
    } catch (error) {
      console.error('Error getting travel suggestions:', error);
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I'm sorry, I couldn't generate travel suggestions at the moment. Please try again later."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to format bullet points in AI responses
  const formatBulletPoints = (text: string) => {
    // Replace markdown bullet points with HTML bullet points
    return text
      // Handle markdown headings
      .replace(/#{1,6}\s+([^\n]+)/g, '<h3 class="text-xl font-bold text-emerald-800 my-3">$1</h3>')
      // Handle bullet points
      .replace(/\n\s*-\s+/g, '\n• ')
      .replace(/\n\s*\*\s+/g, '\n• ')
      .replace(/\n\s*•\s+([^:]+):/g, '\n<div class="flex items-start my-2"><span class="text-emerald-600 mr-2">•</span><span class="font-semibold text-emerald-700">$1:</span></div>')
      .replace(/\n\s*•\s+([^:]+)/g, '\n<div class="flex items-start my-2"><span class="text-emerald-600 mr-2">•</span><span>$1</span></div>')
      // Remove any remaining asterisks used for emphasis
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.3),rgba(255,255,255,0))]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 pb-[8.5rem]">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/">
            <button className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-md text-emerald-700 hover:bg-emerald-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </button>
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-emerald-900 text-center mb-8">
          AI Travel Planner
        </h1>
        
        {/* Messages Display */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col gap-6">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === 'assistant'
                      ? 'bg-emerald-50 border border-emerald-100'
                      : 'bg-white border border-gray-100'
                  } rounded-xl p-5 shadow-sm`}
                >
                  <div className="flex-shrink-0 w-24 font-medium text-emerald-800 capitalize">
                    {message.role === 'assistant' ? 'AI Planner' : 'You'}
                  </div>
                  <div className="flex-grow prose prose-emerald max-w-none prose-headings:text-emerald-700 prose-p:text-gray-700 prose-strong:font-semibold prose-strong:text-emerald-700 prose-a:text-emerald-600">
                    <div dangerouslySetInnerHTML={{ __html: message.content }} />
                  </div>
                </div>
              ))}
              
              {/* Show loading indicator */}
              {isLoading && (
                <div className="flex justify-center py-4">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                    <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                    <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input Form - Fixed at bottom like home page */}
        <form
          onSubmit={handleSubmit}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-4 py-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto flex flex-col gap-3">
            <div className="flex-grow">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-adjust height
                  const textarea = e.target as HTMLTextAreaElement;
                  textarea.style.height = 'auto';
                  textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.shiftKey) {
                    e.preventDefault();
                    const cursorPosition = e.currentTarget.selectionStart || 0;
                    const newValue = input.slice(0, cursorPosition) + '\n' + input.slice(cursorPosition);
                    setInput(newValue);
                    // Adjust height after adding new line
                    setTimeout(() => {
                      const textarea = e.target as HTMLTextAreaElement;
                      textarea.style.height = 'auto';
                      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
                    }, 0);
                  } else if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as unknown as FormEvent);
                    // Reset height after sending
                    const textarea = e.target as HTMLTextAreaElement;
                    textarea.style.height = 'auto';
                  }
                }}
                placeholder="Describe your ideal travel destination and preferences..."
                rows={1}
                className="w-full px-4 py-2 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none overflow-y-auto"
                style={{ maxHeight: '200px', minHeight: '42px' }}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Finding destinations...' : 'Get Travel Suggestions'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
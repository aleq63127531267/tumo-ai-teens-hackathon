'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Define TypeScript interfaces for the Web Speech API
interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  [index: number]: {
    readonly transcript: string;
    readonly confidence: number;
  };
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: (event: Event) => void;
}

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function SpeechTranscriptionPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [language, setLanguage] = useState('en-US');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Define language options
  const languageOptions = [
    { value: 'en-US', label: 'English' },
    { value: 'hy-AM', label: 'Armenian' },
    { value: 'ru-RU', label: 'Russian' },
  ];

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support the Web Speech API. Please try Chrome or Edge.');
      return;
    }

    return () => {
      // Cleanup on unmount
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    // Initialize SpeechRecognition
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionConstructor();
    
    // Configure recognition
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = language;
    
    // Set up event handlers
    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };
    
    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let currentInterimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += result;
        } else {
          currentInterimTranscript += result;
        }
      }
      
      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript);
      }
      
      setInterimTranscript(currentInterimTranscript);
    };
    
    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
    };
    
    // Start recognition
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    // If currently listening, restart with new language
    if (isListening) {
      stopListening();
      setTimeout(() => startListening(), 100);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-200 via-orange-200 to-amber-300">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_120%,rgba(251,146,60,0.3),rgba(255,255,255,0))]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/">
            <button className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-md text-orange-700 hover:bg-orange-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Home
            </button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Speech to Text
          </h1>
          <p className="text-xl text-gray-600">
            Convert your speech into text in real-time
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8">
              <div className="flex-grow">
                <label htmlFor="language" className="block text-lg font-medium text-gray-700 mb-3">
                  Select Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white"
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={toggleListening}
                  className={`px-6 py-4 rounded-xl font-medium text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 text-lg w-full sm:w-auto ${
                    isListening 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  }`}
                >
                  {isListening ? (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      <span>Start Recording</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={clearTranscript}
                  className="px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 flex items-center justify-center gap-2 transition-all duration-200 text-lg w-full sm:w-auto"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear Text</span>
                </button>
              </div>
            </div>
            
            <div className="mb-4 flex items-center">
              <div className="font-medium text-gray-700 flex items-center gap-2">
                Status: 
                <div className="flex items-center gap-2 text-lg">
                  <div 
                    className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}
                  />
                  <span className={isListening ? 'text-red-600' : 'text-gray-600'}>
                    {isListening ? 'Listening...' : 'Not listening'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-6 min-h-[300px] bg-gray-50">
              <p className="whitespace-pre-wrap text-lg">
                {transcript}
                <span className="text-gray-500">{interimTranscript}</span>
                {!transcript && !interimTranscript && (
                  <span className="text-gray-400">Your transcribed text will appear here...</span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-blue-900 font-medium">Tips for best results:</p>
                <ul className="mt-2 text-sm text-blue-800 space-y-1">
                  <li>• Speak clearly and at a normal pace</li>
                  <li>• Use a good quality microphone</li>
                  <li>• Minimize background noise</li>
                  <li>• Make sure your browser has microphone permissions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


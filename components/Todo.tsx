'use client';

import { useState, useEffect } from 'react';

export default function Todo() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <svg 
          className="w-16 h-16 mx-auto text-gray-400 mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M6 18L18 6M6 6l12 12" 
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Website Removed</h1>
        <p className="text-gray-600 mb-6">
          The Todo list website has been removed as requested.
        </p>
        <a 
          href="/"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to Home
        </a>
      </div>
    </div>
  );
} 

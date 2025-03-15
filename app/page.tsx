'use client';

/* eslint-disable @next/next/no-img-element */
import { getTextFromDataUrl } from '@ai-sdk/ui-utils';
import { useChat } from '@ai-sdk/react';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Page() {
  const { messages, input, handleSubmit, handleInputChange, status } = useChat({
    api: '/api/chat',
  });

  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-violet-100 via-indigo-100 to-blue-200 pb-[8.5rem]">
      <div className="fixed inset-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))] pointer-events-none" style={{ minHeight: '100vh' }}></div>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          AI Assistant Platform
        </h1>
        
        {/* Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/generate-image">
            <div className="group hover:scale-105 transition-all duration-200">
              <button className="w-full px-6 py-4 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-lg">Generate Image</span>
              </button>
            </div>
          </Link>
          
          <Link href="/text-to-speech">
            <div className="group hover:scale-105 transition-all duration-200">
              <button className="w-full px-6 py-4 text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span className="text-lg">Text to Speech</span>
              </button>
            </div>
          </Link>
          
          <Link href="/speech-to-text">
            <div className="group hover:scale-105 transition-all duration-200">
              <button className="w-full px-6 py-4 text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="text-lg">Speech to Text</span>
              </button>
            </div>
          </Link>
          
          <Link href="/write-book">
            <div className="group hover:scale-105 transition-all duration-200">
              <button className="w-full px-6 py-4 text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-lg">Write Book</span>
              </button>
            </div>
          </Link>

          <Link href="/travel-planner">
            <div className="group hover:scale-105 transition-all duration-200">
              <button className="w-full px-6 py-4 text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg">Travel Planner</span>
              </button>
            </div>
          </Link>

          <Link href="/recipe-finder">
            <div className="group hover:scale-105 transition-all duration-200">
              <button className="w-full px-6 py-4 text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
                <span className="text-lg">Recipe Finder</span>
              </button>
            </div>
          </Link>
        </div>

        {/* Chat Messages */}
        {isMainPage && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-24">
              <div className="flex flex-col gap-4">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex gap-4 ${
                      message.role === 'assistant' ? 'bg-blue-50' : 'bg-gray-50'
                    } rounded-xl p-4`}
                  >
                    <div className="flex-shrink-0 w-24 font-medium text-gray-700 capitalize">
                      {`${message.role}`}
                    </div>

                    <div className="flex flex-col gap-3 flex-grow">
                      <div className="text-gray-800 whitespace-pre-wrap break-words">{message.content}</div>

                      <div className="flex flex-wrap gap-3">
                        {message.experimental_attachments?.map((attachment, index) =>
                          attachment.contentType?.includes('image/') ? (
                            <img
                              key={`${message.id}-${index}`}
                              className="w-32 h-32 object-cover rounded-lg shadow-sm"
                              src={attachment.url}
                              alt={attachment.name}
                            />
                          ) : attachment.contentType?.includes('text/') ? (
                            <div className="w-32 h-32 p-3 overflow-hidden text-sm border rounded-lg bg-white shadow-sm">
                              {getTextFromDataUrl(attachment.url)}
                            </div>
                          ) : null,
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={event => {
                handleSubmit(event, {
                  experimental_attachments: files,
                });
                setFiles(undefined);

                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-4 py-4 sm:px-6 lg:px-8"
            >
              <div className="max-w-7xl mx-auto flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    onChange={event => {
                      if (event.target.files) {
                        setFiles(event.target.files);
                      }
                    }}
                    multiple
                    ref={fileInputRef}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Attach Files
                  </label>
                  
                  <div className="flex-grow">
                    <textarea
                      value={input}
                      placeholder="Type your message..."
                      onChange={(e) => {
                        handleInputChange(e);
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
                          const event = { target: { value: newValue } } as React.ChangeEvent<HTMLTextAreaElement>;
                          handleInputChange(event);
                          // Adjust height after adding new line
                          setTimeout(() => {
                            const textarea = e.target as HTMLTextAreaElement;
                            textarea.style.height = 'auto';
                            textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
                          }, 0);
                        } else if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e as unknown as React.FormEvent);
                          // Reset height after sending
                          const textarea = e.target as HTMLTextAreaElement;
                          textarea.style.height = 'auto';
                        }
                      }}
                      rows={1}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none overflow-y-auto"
                      style={{ maxHeight: '200px', minHeight: '42px' }}
                      disabled={status !== 'ready'}
                    />
                  </div>
                </div>

                {/* File Preview */}
                {files && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Array.from(files).map(attachment => {
                      const { type } = attachment;

                      if (type.startsWith('image/')) {
                        return (
                          <div key={attachment.name} className="relative group">
                            <img
                              className="w-16 h-16 object-cover rounded-lg"
                              src={URL.createObjectURL(attachment)}
                              alt={attachment.name}
                            />
                            <span className="absolute bottom-0 left-0 right-0 text-xs text-center text-white bg-black bg-opacity-50 rounded-b-lg p-1 truncate">
                              {attachment.name}
                            </span>
                          </div>
                        );
                      } else if (type.startsWith('text/')) {
                        return (
                          <div
                            key={attachment.name}
                            className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg"
                          >
                            <span className="text-xs text-gray-500 text-center p-1 truncate">
                              {attachment.name}
                            </span>
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

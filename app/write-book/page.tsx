'use client';

import { useCompletion } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Chat() {
  const [pageCount, setPageCount] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [partialPages, setPartialPages] = useState<string[]>([]);
  const [generatedChapters, setGeneratedChapters] = useState(0);
  
  const requestedChapters = pageCount ? Math.max(1, Math.ceil(parseInt(pageCount) / 2)) : undefined;
  
  const { completion, input, handleInputChange, handleSubmit, error, data, isLoading, stop } =
    useCompletion({
      api: '/api/write-book',
      body: {
        pageCount: pageCount ? parseInt(pageCount) : undefined,
        chapterCount: requestedChapters,
        format: 'markdown'
      },
      onFinish: () => setGenerationProgress(100),
      onError: () => {
        setGenerationProgress(0);
        setPartialPages([]);
        setGeneratedChapters(0);
      }
    });

  // Helper function to split paragraphs into pages
  const splitIntoPages = (paragraphs: string[], requestedPages: number): string[] => {
    let newPages: string[] = [];
    let currentPage: string[] = [];
    let pageCounter = 0;
    
    for (let i = 0; i < paragraphs.length && (requestedPages === 0 || pageCounter < requestedPages); i++) {
      const paragraph = paragraphs[i];
      const isChapterBreak = /^(#|Chapter\s+\d+|CHAPTER\s+\d+)/i.test(paragraph.trim());
      
      if (isChapterBreak && currentPage.length > 0 && (requestedPages === 0 || pageCounter < requestedPages - 1)) {
        newPages.push(currentPage.join('\n\n'));
        currentPage = [paragraph];
        pageCounter++;
      } else {
        currentPage.push(paragraph);
        
        if (currentPage.join('\n\n').length > 1500 && (requestedPages === 0 || pageCounter < requestedPages - 1)) {
          const nextParagraph = paragraphs[i + 1];
          const nextIsChapter = nextParagraph && /^(#|Chapter\s+\d+|CHAPTER\s+\d+)/i.test(nextParagraph.trim());
          
          if (!nextIsChapter) {
            newPages.push(currentPage.join('\n\n'));
            currentPage = [];
            pageCounter++;
          }
        }
      }
    }
    
    if (currentPage.length > 0) {
      newPages.push(currentPage.join('\n\n'));
    }
    
    return newPages;
  };

  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [jumpToPage, setJumpToPage] = useState('');

  // Update final pages when generation is complete
  useEffect(() => {
    if (completion) {
      const paragraphs = completion.split('\n\n').filter(p => p.trim());
      const requestedPages = pageCount ? parseInt(pageCount) : Math.ceil(paragraphs.length / 3);
      const newPages = splitIntoPages(paragraphs, requestedPages);
      setPages(newPages);
      setPartialPages([]);
    }
  }, [completion, pageCount]);

  // Helper function to count chapters in text
  const countChapters = (text: string): number => {
    const matches = text.match(/^(#|Chapter\s+\d+|CHAPTER\s+\d+)/gim);
    return matches ? matches.length : 0;
  };

  // Update partial pages and progress as completion grows
  useEffect(() => {
    if (completion && isLoading) {
      const paragraphs = completion.split('\n\n').filter(p => p.trim());
      const requestedPages = pageCount ? parseInt(pageCount) : Math.ceil(paragraphs.length / 3);
      const newPages = splitIntoPages(paragraphs, requestedPages);
      setPartialPages(newPages);
      
      // Count chapters in the current completion
      const currentChapters = countChapters(completion);
      setGeneratedChapters(currentChapters);
      
      // Calculate progress based on both pages and chapters
      if (requestedPages > 0 && requestedChapters) {
        const pageProgress = Math.min(100, Math.round((newPages.length / requestedPages) * 100));
        const chapterProgress = Math.min(100, Math.round((currentChapters / requestedChapters) * 100));
        // Weight chapter progress more heavily to ensure we don't stop too early
        const totalProgress = Math.min(100, Math.round((pageProgress + chapterProgress * 2) / 3));
        setGenerationProgress(totalProgress);
        
        // Stop generation if we've reached our chapter goal and have enough pages
        if (currentChapters >= requestedChapters && newPages.length >= requestedPages) {
          stop();
        }
      }
    }
  }, [completion, isLoading, pageCount, requestedChapters, stop]);

  // Reset states when starting new generation
  useEffect(() => {
    if (isLoading) {
      setPartialPages([]);
      setGenerationProgress(0);
      setCurrentPage(0);
      setGeneratedChapters(0);
    }
  }, [isLoading]);

  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
      setJumpToPage('');
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setJumpToPage('');
    }
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= (isLoading ? partialPages.length : pages.length)) {
      setCurrentPage(pageNum - 1);
      setJumpToPage('');
    } else {
      setJumpToPage('');
    }
  };

  // Add keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't handle navigation when typing in inputs
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToPreviousPage();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]); // Add currentPage to dependencies

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(234,179,8,0.1),rgba(255,255,255,0))]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/">
            <button className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-md text-amber-700 hover:bg-amber-50 transition-colors">
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
            AI Book Writer
          </h1>
          <p className="text-xl text-gray-600">
            Generate creative stories and books with AI
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error.message}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (isLoading) {
                  stop();
                } else {
                  handleSubmit(e);
                }
              }} className="mb-8">
                <div className="flex flex-col gap-4">
                  <label htmlFor="topic" className="block text-lg font-medium text-gray-700">
                    Enter Book Topic
                  </label>
                  <div className="flex gap-4">
                    <input
                      id="topic"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      value={input}
                      placeholder="Enter your book topic or idea..."
                      onChange={handleInputChange}
                    />
                    <input
                      type="number"
                      value={pageCount}
                      onChange={(e) => setPageCount(e.target.value)}
                      placeholder="Pages (optional)"
                      className="w-40 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      min="1"
                    />
                    <button
                      type="submit"
                      className={`px-6 py-3 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200 text-lg font-medium flex items-center gap-2 ${
                        isLoading 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-500'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:ring-amber-500'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Stop Generation</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          <span>Generate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {isLoading && generationProgress < 100 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Generating book... {partialPages.length} {pageCount ? `/ ${pageCount}` : ''} pages, 
                      {' '}{generatedChapters} {requestedChapters ? `/ ${requestedChapters}` : ''} chapters
                    </span>
                    <span className="text-sm font-medium text-gray-700">{generationProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {(completion || (isLoading && partialPages.length > 0)) && (
                <div className="relative">
                  {/* Combined Navigation Controls */}
                  <div className="flex justify-center items-center mb-4">
                    <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg shadow-sm">
                      {/* Left Arrow */}
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 0}
                        className="text-amber-700 hover:text-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        aria-label="Previous page"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <span className="text-amber-700">Go to</span>
                      <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={jumpToPage}
                          onChange={(e) => setJumpToPage(e.target.value)}
                          className="w-16 px-2 py-1 text-center border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder={`1-${isLoading ? partialPages.length : pages.length}`}
                        />
                        <button
                          type="submit"
                          className="px-3 py-1 text-white bg-amber-500 hover:bg-amber-600 rounded transition-colors duration-200"
                        >
                          Go
                        </button>
                      </form>

                      {/* Right Arrow */}
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === (isLoading ? partialPages.length - 1 : pages.length - 1)}
                        className="text-amber-700 hover:text-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        aria-label="Next page"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="prose prose-lg max-w-none min-h-[500px] bg-amber-50/30 rounded-xl p-8 border border-amber-100" style={{ backgroundImage: "linear-gradient(180deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)", backgroundSize: "100% 2rem" }}>
                      <div className="absolute top-2 right-4 text-amber-700 text-sm font-medium">
                        Page {currentPage + 1} of {isLoading ? partialPages.length : pages.length}
                      </div>
                      <ReactMarkdown
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1 className="text-3xl font-bold text-gray-900 mb-4" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 className="text-2xl font-bold text-gray-900 mb-3" {...props} />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3 className="text-xl font-bold text-gray-900 mb-2" {...props} />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="text-gray-700 mb-4 leading-relaxed" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc list-inside mb-4" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal list-inside mb-4" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="text-gray-700 mb-2" {...props} />
                          ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-amber-500 pl-4 italic text-gray-700 mb-4" {...props} />
                          ),
                        }}
                      >
                        {isLoading ? partialPages[currentPage] : pages[currentPage]}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}

              {!completion && !isLoading && (
                <div className="text-center text-gray-500 py-12">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p>Enter a topic above and click Generate to create your book</p>
                </div>
              )}
            </div>
          </div>

          {data && (
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Debug Information</h3>
              <pre className="text-sm text-gray-600 overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Book } from '../types';
import {
  CloseIcon, HighlightIcon, ZoomInIcon, ZoomOutIcon, ArrowLeftIcon, ArrowRightIcon,
  SearchIcon, ChevronLeftIcon, ChevronRightIcon
} from './icons/index';

// Set the worker source for pdf.js
if (typeof window !== 'undefined' && 'pdfjsLib' in window) {
  (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;
}

interface SearchResult {
  pageIndex: number;
  match: any; // Using 'any' for simplicity, pdf.js text content item is complex
}

interface BookReaderProps {
  book: Book;
  onClose: () => void;
}

const BookReader: React.FC<BookReaderProps> = ({ book, onClose }) => {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load PDF document
  useEffect(() => {
    if (!book.file) {
      setError('No file available for this book.');
      return;
    }
    if (book.format.toLowerCase() !== 'pdf') {
      setError(`Unsupported format: .${book.format}. Preview is only available for PDF files.`);
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      if (!event.target?.result) return;
      const typedArray = new Uint8Array(event.target.result as ArrayBuffer);
      try {
        const loadingTask = (window as any).pdfjsLib.getDocument(typedArray);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
      } catch (e) {
        console.error('Failed to load PDF:', e);
        setError('Could not load the PDF file. It might be corrupted.');
      }
    };
    fileReader.onerror = () => {
      setError('Failed to read the file.');
    };
    fileReader.readAsArrayBuffer(book.file);
  }, [book]);

  // Render current page
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    const page = await pdfDoc.getPage(currentPage);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const scale = zoomLevel / 100;
    const viewport = page.getViewport({ scale: scale * dpr });

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = `${viewport.width / dpr}px`;
    canvas.style.height = `${viewport.height / dpr}px`;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Highlight search results
    if (searchResults.length > 0) {
      const textContent = await page.getTextContent();
      const pageResults = searchResults.filter(r => r.pageIndex === currentPage - 1);
      
      pageResults.forEach((result, index) => {
        const item = textContent.items.find((i: any) => i.str === result.match.str && i.transform.toString() === result.match.transform.toString());
        if (item) {
          const isCurrent = currentResultIndex !== -1 && searchResults[currentResultIndex].pageIndex === result.pageIndex && searchResults[currentResultIndex].match === result.match;
          ctx.fillStyle = isCurrent ? 'rgba(255, 165, 0, 0.5)' : 'rgba(255, 255, 0, 0.5)';
          const [fontHeight, , , , tx, ty] = item.transform;
          const x = tx * scale * dpr;
          const y = viewport.height - ty * scale * dpr - fontHeight * scale * dpr;
          const width = item.width * scale * dpr;
          const height = fontHeight * scale * dpr;
          ctx.fillRect(x, y, width, height);
        }
      });
    }

  }, [pdfDoc, currentPage, zoomLevel, searchResults, currentResultIndex]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);


  const goToPrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = Number(e.target.value);
    if(newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowLeft') goToPrevPage();
      else if (event.key === 'ArrowRight') goToNextPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToPrevPage, goToNextPage]);

  const zoomIn = () => setZoomLevel((prev) => Math.min(200, prev + 10));
  const zoomOut = () => setZoomLevel((prev) => Math.max(50, prev - 10));

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfDoc || !searchQuery) {
      setSearchResults([]);
      setCurrentResultIndex(-1);
      return;
    }
    setIsSearching(true);
    const results: SearchResult[] = [];
    const lowerCaseQuery = searchQuery.toLowerCase();

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      textContent.items.forEach((item: any) => {
        if (item.str.toLowerCase().includes(lowerCaseQuery)) {
          results.push({ pageIndex: i - 1, match: item });
        }
      });
    }
    setSearchResults(results);
    if (results.length > 0) {
      setCurrentResultIndex(0);
      setCurrentPage(results[0].pageIndex + 1);
    } else {
      setCurrentResultIndex(-1);
    }
    setIsSearching(false);
  };

  const goToResult = (index: number) => {
    if (index < 0 || index >= searchResults.length) return;
    setCurrentResultIndex(index);
    setCurrentPage(searchResults[index].pageIndex + 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col z-50" role="dialog" aria-modal="true">
      <header className="bg-slate-800 text-white p-3 flex items-center justify-between shadow-md flex-shrink-0">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold truncate" title={book.title}>{book.title}</h2>
        </div>
        <div className="flex items-center gap-2 ml-4">
           {/* Search */}
           <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-700 rounded-md py-1.5 pl-8 pr-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500 w-48"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <SearchIcon className="h-4 w-4 text-slate-400" />
              </div>
            </div>
             {isSearching && <span className="text-sm text-slate-400">Searching...</span>}
             {searchResults.length > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <span>{currentResultIndex + 1} of {searchResults.length}</span>
                <button onClick={() => goToResult(currentResultIndex - 1)} disabled={currentResultIndex <= 0} className="p-1 rounded-full hover:bg-slate-700 disabled:opacity-50">
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button onClick={() => goToResult(currentResultIndex + 1)} disabled={currentResultIndex >= searchResults.length - 1} className="p-1 rounded-full hover:bg-slate-700 disabled:opacity-50">
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </form>

          <div className="border-l border-slate-600 h-6 mx-2"></div>
          {/* Zoom & Close */}
          <button onClick={zoomOut} className="p-2 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal-500" aria-label="Zoom out"><ZoomOutIcon className="h-5 w-5" /></button>
          <button onClick={zoomIn} className="p-2 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal-500" aria-label="Zoom in"><ZoomInIcon className="h-5 w-5" /></button>
          <button className="p-2 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal-500" aria-label="Highlight text"><HighlightIcon className="h-5 w-5" /></button>
          <div className="border-l border-slate-600 h-6 mx-2"></div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal-500" aria-label="Close reader"><CloseIcon className="h-6 w-6" /></button>
        </div>
      </header>
      
      <main ref={containerRef} className="flex-1 bg-slate-500 overflow-auto p-4 flex justify-center items-start">
        {error ? (
           <div className="bg-white rounded-md p-8 text-center shadow-lg">
             <h3 className="text-xl font-semibold text-red-600">Error</h3>
             <p className="text-slate-700 mt-2">{error}</p>
           </div>
        ) : pdfDoc ? (
            <canvas ref={canvasRef} className="shadow-2xl"></canvas>
        ) : (
          <div className="text-white text-lg">Loading document...</div>
        )}
      </main>

      {pdfDoc && !error && (
        <footer className="bg-slate-800 text-white p-3 flex items-center justify-center shadow-inner flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={goToPrevPage} disabled={currentPage === 1} className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-teal-500" aria-label="Previous page">
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2 text-sm">
              <span>Page</span>
              <input 
                type="number"
                value={currentPage}
                onChange={handlePageInputChange}
                className="w-16 bg-slate-700 text-center rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
                min="1"
                max={totalPages}
              />
              <span>of {totalPages}</span>
            </div>
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-teal-500" aria-label="Next page">
              <ArrowRightIcon className="h-6 w-6" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default BookReader;

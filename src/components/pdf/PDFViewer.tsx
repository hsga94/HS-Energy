import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Set worker source path
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string;
  allowDownload?: boolean;
}

export const PDFViewer = ({ url, allowDownload = false }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Add print prevention styles
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body * {
          display: none !important;
          visibility: hidden !important;
        }
        body:after {
          content: "Impressão não permitida";
          display: block !important;
          visibility: visible !important;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    `;
    document.head.appendChild(style);

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Prevent printing using keyboard shortcuts and context menu
    const preventPrinting = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.key === 'p') || 
        (e.metaKey && e.key === 'p') ||
        (e.ctrlKey && e.key === 's') ||
        (e.metaKey && e.key === 's')
      ) {
        e.preventDefault();
        toast.error("Impressão e download não permitidos");
      }
    };

    // Prevent right-click
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast.error("Impressão e download não permitidos");
    };

    window.addEventListener('keydown', preventPrinting);
    document.addEventListener('contextmenu', preventContextMenu);

    // Prevent using browser's print function
    const preventBrowserPrint = () => {
      toast.error("Impressão não permitida");
      return false;
    };
    window.onbeforeprint = preventBrowserPrint;

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', preventPrinting);
      document.removeEventListener('contextmenu', preventContextMenu);
      window.onbeforeprint = null;
      document.head.removeChild(style);
    };
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    console.log("PDF document loaded successfully");
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full mt-20 md:mt-0">
      <div className="flex items-center space-x-2 mt-2 mb-2 sticky top-20 md:top-0 bg-background z-10 w-full justify-center py-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          disabled={scale <= 0.5}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm">{Math.round(scale * 100)}%</span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          disabled={scale >= 2.0}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[600px] w-full border rounded-lg">
        <div className="flex justify-center p-4">
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            className="max-w-full"
            loading={
              <div className="flex items-center justify-center h-[600px] w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              scale={scale}
              width={width > 768 ? undefined : width - 48}
              className="max-w-full h-auto"
            />
          </Document>
        </div>
      </ScrollArea>
      
      <div className="flex items-center space-x-4 sticky bottom-4 bg-background z-10 py-2">
        <Button
          variant="outline"
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm">
          Página {pageNumber} de {numPages}
        </span>
        
        <Button
          variant="outline"
          onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
          disabled={pageNumber >= numPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
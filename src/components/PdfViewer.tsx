import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

// Workaround for PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// A4 dimensions in pixels (96 DPI)
const A4_WIDTH = 595.276; // 210mm at 96 DPI
const A4_HEIGHT = 841.89; // 297mm at 96 DPI

interface PdfViewerProps {
  pdfUrl: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        // Calculate scale to fit A4 width
        const viewport = page.getViewport({ scale: 1 });
        const scale = A4_WIDTH / viewport.width;

        const scaledViewport = page.getViewport({ scale });

        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if (canvas && context) {
          canvas.width = A4_WIDTH;
          canvas.height = A4_HEIGHT;

          const renderContext = {
            canvasContext: context,
            viewport: scaledViewport,
          };

          await page.render(renderContext).promise;
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, [pdfUrl]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePosition({ x, y });
    }
  };

  return (
    <div className="a4-container"
      style={{
        padding: '20px',
        background: '#333',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div
        ref={containerRef}
        style={{ 
          position: 'relative', 
          display: 'inline-block',
          width: `${A4_WIDTH}px`,
          height: `${A4_HEIGHT}px`,
          background: 'white',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          border: '1px solid black',
        }}
        onMouseMove={handleMouseMove}
      >
        <canvas 
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        
        {/* Vertical line (Y-axis) */}
        <div
          style={{
            position: 'absolute',
            left: `${mousePosition.x}px`,
            top: 0,
            width: '1px',
            height: '100%',
            backgroundColor: 'red',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        
        {/* Horizontal line (X-axis) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: `${mousePosition.y}px`,
            width: '100%',
            height: '1px',
            backgroundColor: 'red',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        
        {/* Coordinates display */}
        <div
          style={{
            position: 'absolute',
            left: `${mousePosition.x + 10}px`,
            top: `${mousePosition.y + 10}px`,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          X: {Math.round(mousePosition.x)}, Y: {Math.round(mousePosition.y)}
        </div>
      </div>
    </div>
  );
};

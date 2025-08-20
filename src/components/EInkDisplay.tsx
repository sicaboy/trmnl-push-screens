'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';

interface EInkDisplayProps {
  children: React.ReactNode;
  className?: string;
}

export interface EInkDisplayRef {
  getHTML: () => string;
}

const EInkDisplay = forwardRef<EInkDisplayRef, EInkDisplayProps>(
  ({ children, className = '' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getHTML: () => {
        if (containerRef.current) {
          return containerRef.current.innerHTML;
        }
        return '';
      },
    }));

    return (
      <div className={`w-[800px] h-[480px] bg-white overflow-hidden ${className}`}>
        <style jsx global>{`
          .eink-display {
            filter: grayscale(100%);
            -webkit-filter: grayscale(100%);
          }
          .eink-display * {
            color: black !important;
            background-color: white !important;
            border-color: #666 !important;
          }
          .eink-display .bg-gray-200 {
            background-color: #e5e5e5 !important;
          }
          .eink-display .bg-gray-800 {
            background-color: #333 !important;
            color: white !important;
          }
          .eink-display .text-white {
            color: white !important;
          }
        `}</style>
        <div ref={containerRef} className="eink-display w-full h-full">
          {children}
        </div>
      </div>
    );
  }
);

EInkDisplay.displayName = 'EInkDisplay';

export default EInkDisplay;
import React, { useState } from 'react';
import { RadioDial } from './components/RadioDial';

export default function App() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Backdrop overlay when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40 transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Dial container */}
      <div
        className={`fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ease-in-out cursor-pointer ${
          isExpanded ? 'left-[33%] -translate-x-1/2' : 'left-0 -translate-x-[70%]'
        }`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <RadioDial />
      </div>
    </div>
  );
}
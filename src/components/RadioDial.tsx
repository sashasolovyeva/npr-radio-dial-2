import React, { useState, useRef, useEffect } from 'react';
import { dialData, getActiveOption, DialOption } from '../data/dialData';

interface RadioDialProps {
  minFrequency?: number;
  maxFrequency?: number;
  initialFrequency?: number;
  onFrequencyChange?: (frequency: number) => void;
  onFilterChange?: (filters: {
    outer: DialOption | null;
    middle: DialOption | null;
    inner: DialOption | null;
  }) => void;
  externalOuterAngle?: number;
  externalMiddleAngle?: number;
  externalInnerAngle?: number;
  isConnected?: boolean;
  onCenterDotClick?: () => void;
}

type DialLayer = 'outer' | 'middle' | 'inner' | null;

export function RadioDial({
  minFrequency = -180.0,
  maxFrequency = 180.0,
  initialFrequency = 0.0,
  onFrequencyChange,
  onFilterChange, 
  externalOuterAngle,
  externalMiddleAngle,
  externalInnerAngle,
  isConnected = false,
  onCenterDotClick
}: RadioDialProps) {
  const [outerAngle, setOuterAngle] = useState(externalOuterAngle ?? 0);
  const [middleAngle, setMiddleAngle] = useState(externalMiddleAngle ?? 0);
  const [innerAngle, setInnerAngle] = useState(externalInnerAngle ?? 0);
  const [activeLayer, setActiveLayer] = useState<DialLayer>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const normalizedOuterAngle = ((outerAngle % 360) + 360) % 360;
  const outerLabelRadius = 210;

  // Get active filtering options based on current angles
  const activeOuterOption = getActiveOption(outerAngle, dialData.outer);
  const activeMiddleOption = getActiveOption(middleAngle, dialData.middle);
  const activeInnerOption = getActiveOption(innerAngle, dialData.inner);

  // Notify parent component when filter options change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        outer: activeOuterOption,
        middle: activeMiddleOption,
        inner: activeInnerOption,
      });
    }
  }, [outerAngle, middleAngle, innerAngle, activeOuterOption, activeMiddleOption, activeInnerOption, onFilterChange]);

  // Calculate angle from mouse/touch position
  const calculateAngle = (clientX: number, clientY: number) => {
    if (!dialRef.current) return 0;
    
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    return angle;
  };

  const isClickOnCenterDot = (clientX: number, clientY: number): boolean => {
    if (!dialRef.current) return false;
    
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Center dot is 50px diameter, so radius is 25px
    return distance <= 25;
  };

  // Determine which layer was clicked
  const getClickedLayer = (clientX: number, clientY: number): DialLayer => {
    if (!dialRef.current) return null;
    
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const radius = rect.width / 2;
    
    // Determine which ring based on distance from center
    // Made the inner dial more sensitive to clicks
    if (distance > radius * 0.7) return 'outer';
    if (distance > radius * 0.45) return 'middle';
    if (distance > radius * 0.15) return 'inner'; // Increased from 0.3 to make it easier to click
    return null;
  };

  const updateAngle = (clientX: number, clientY: number) => {
    const angle = calculateAngle(clientX, clientY);
    
    if (activeLayer === 'outer') {
      setOuterAngle(angle);
      console.log('outerAngle', angle);
    } else if (activeLayer === 'middle') {
      setMiddleAngle(angle);
    } else if (activeLayer === 'inner') {
      setInnerAngle(angle);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isClickOnCenterDot(e.clientX, e.clientY)) {
      e.stopPropagation();
      onCenterDotClick?.();
      return;
    }
    
    const layer = getClickedLayer(e.clientX, e.clientY);
    setActiveLayer(layer);
    if (layer) {
      updateAngle(e.clientX, e.clientY);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];

    if (isClickOnCenterDot(touch.clientX, touch.clientY)) {
      e.stopPropagation();
      onCenterDotClick?.();
      return;
    }

    const layer = getClickedLayer(touch.clientX, touch.clientY);
    setActiveLayer(layer);
    if (layer) {
      updateAngle(touch.clientX, touch.clientY);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (activeLayer) {
        updateAngle(e.clientX, e.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (activeLayer) {
        e.preventDefault();
        const touch = e.touches[0];
        updateAngle(touch.clientX, touch.clientY);
      }
    };

    const handleEnd = () => {
      setActiveLayer(null);
    };

    if (activeLayer) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [activeLayer, outerAngle, middleAngle, innerAngle]);

  useEffect(() => {
    if (externalOuterAngle !== undefined) {
      setOuterAngle(externalOuterAngle);
    }
  }, [externalOuterAngle]);

  useEffect(() => {
    if (externalMiddleAngle !== undefined) {
      setMiddleAngle(externalMiddleAngle);
    }
  }, [externalMiddleAngle]);

  useEffect(() => {
    if (externalInnerAngle !== undefined) {
      setInnerAngle(externalInnerAngle);
    }
  }, [externalInnerAngle]);

  // Generate tick marks for a circle
  const generateTicks = (count: number) => {
    return Array.from({ length: count }, (_, i) => (360 / count) * i);
  };

  return (
    <div className="relative flex items-center justify-center gap-4 dial-outer-container">
      <div
        ref={dialRef}
        className="relative size-[373px] cursor-pointer select-none touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >

      {/* Center dot (doesn't rotate) */}
      <div 
        className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-dial-ticks shadow-md z-10 transition-all duration-300 cursor-pointer hover:scale-110" 
        style={{ 
          backgroundColor: '#7b7b7b',
          width: '50px',
          height: '50px',
          boxShadow: `inset 0 0 2px rgba(0,0,0,0.3), 0 0 60px rgba(0,0,0,0.6), inset 0 0 8px ${isConnected ? 'rgba(43,123,189,0.8)' : 'rgba(255,0,0,0.6)'}`,
        }} 
      />

      {/* Outer dial */}
      <div>
        <div
          className="absolute inset-0 transition-transform"
          style={{
            transform: `rotate(${outerAngle}deg)`,
            transitionDuration: activeLayer === 'outer' ? '0ms' : '200ms'
          }}
        >
          <div 
            className="absolute inset-0 rounded-full bg-dial shadow-xl" 
            style={{
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.3), 0 0 300px rgba(0,0,0)'
            }}
          />
          
          {/* Tick marks on outer circle - inside */}
          {/* divisible by 8 */}
          {generateTicks(56).map((tickAngle, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 origin-bottom"
              style={{
                transform: `translate(-50%, -50%) rotate(${tickAngle}deg)`
              }}
            >
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[186.5px] w-1 h-2 bg-dial-ticks rounded-full" />
            </div>
          ))}
        </div>

        {/* Dial arc */}
        <div
            className="dialarc1"
        ></div>
      </div>
        
      {/* Middle dial */}
      <div
        className="absolute inset-[15%]"
      >
        <div
          className="transition-transform"
          style={{
            transform: `rotate(${middleAngle}deg)`,
            transitionDuration: activeLayer === 'middle' ? '0ms' : '200ms',
            width: '100%',
            height: '100%',
            position: 'absolute'
          }}
        >
          <div 
            className="absolute inset-0 rounded-full bg-dial" 
            style={{
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.3), 0 0 60px rgba(0,0,0,0.6)'
            }}
          />
          
          {/* Tick marks on middle circle - inside */}
          {/* divisible by 4 */}
          {generateTicks(32).map((tickAngle, i) => (
            <div
              key={i}
              className="absolute origin-bottom"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${tickAngle}deg)`
              }}
            >
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[130px] w-1 h-2 bg-dial-ticks rounded-full" />
            </div>
          ))}
        </div>

        {/* Dial arc */}
        <div
            className="dialarc2"
        ></div>
      </div>
      
      {/* Inner dial */}
      <div
        className="absolute inset-[30%]" 
      >
        <div
          className="transition-transform"
          style={{
            transform: `rotate(${innerAngle}deg)`,
            transitionDuration: activeLayer === 'inner' ? '0ms' : '200ms',
            width: '100%',
            height: '100%',
            position: 'absolute'
          }}
        >
          <div 
            className="absolute inset-0 rounded-full bg-dial" 
            style={{
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.3), 0 0 60px rgba(0,0,0,0.6)'
            }}
          />
          
          {/* Tick marks */}
          {generateTicks(10).map((tickAngle, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 origin-bottom"
              style={{
                transform: `translate(-50%, -50%) rotate(${tickAngle}deg)`
              }}
            >
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[75px] w-1 h-2 bg-dial-ticks rounded-full" />
            </div>
          ))}
        </div>

        {/* Dial arc */}
        <div
            className="dialarc3"
        ></div>
      </div>
      
      {/* Fixed dial indicator line (stays on the right, goes from center to outside) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="absolute left-1/2 top-1/2 h-1 origin-left" style={{ transform: 'translate(0, -50%)', rotate: '22.5deg', backgroundColor: '#7b7b7b', width: '187px', borderRadius: '2px' }} />
        <div className="absolute left-1/2 top-1/2 h-1 origin-left" style={{ transform: 'translate(0, -50%)', rotate: '-22.5deg', backgroundColor: '#7b7b7b', width: '187px', borderRadius: '2px' }} />
      </div>

      {/* Rotating outer labels */}
      <div
        className="outer-label-overlay"
        style={{
          transform: `rotate(${outerAngle}deg)`,
          transitionDuration: activeLayer === 'outer' ? '0ms' : '200ms'
        }}
      >
        {dialData.outer.map((option) => {
          const isActive = activeOuterOption?.label === option.label;
          return (
            <div
              key={option.label}
              className={`outer-label-item${isActive ? ' outer-label-item--active' : ''}`}
              style={{
                transform: `translate(-50%, -50%) rotate(${option.angle}deg) translate(0, -${outerLabelRadius - outerLabelRadius/4}px)`
              }}
            >
              {option.label}
            </div>
          );
        })}
      </div>
      
      </div>
      
      {/* Active outer label display */}
      {/* {activeOuterOption && (
        <div className="outer-label">
          {activeOuterOption.label}
        </div>
      )} */}
    </div>
  );
}
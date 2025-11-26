/// <reference path="./serial.d.ts" />
import React, { useState, useRef } from 'react';
import { RadioDial } from './components/RadioDial';

import { DialOption } from './data/dialData'; 
// Assuming the CSV is parsed or exported as a JSON array in this path
import storyData from './data/final_data_clean.json'; 

interface Story {
  id: string; // Keep as string, assuming your data is correct, we will cast it below
  category: string;
  subcategory: string;
  title: string;
  text: string;
  // Include all additional fields present in the JSON array from the CSV
  collectionNames: string; 
  publishDateTime: string;
  profiles: any; // Use 'any' to avoid deep typing for complex/inconsistent objects
  collections: any;
}

export default function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Disconnected');
  const [outerAngle, setOuterAngle] = useState(0);
  const [middleAngle, setMiddleAngle] = useState(0);
  const [innerAngle, setInnerAngle] = useState(0);
  const [rawValues, setRawValues] = useState({ pot1: 0, pot2: 0, pot3: 0 });

  const [activeFilters, setActiveFilters] = useState<{
    outer: DialOption | null;
    middle: DialOption | null;
    inner: DialOption | null;
  }>({ outer: null, middle: null, inner: null });
  
  const portRef = useRef<SerialPort | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const isReadingRef = useRef(false); // Prevent multiple read loops

  const mapToAngle = (value: number) => {
    return (value / 1023) * 360 - 180;
  };

  const displayStories = React.useMemo(() => {
    // [FIX] Cast storyData to the expected Story[] type to override the compiler's inference
    // This tells TypeScript: "I know the data has these types, trust me."
    const stories = storyData as Story[]; 
    
    if (!activeFilters.outer) return [];
    
    // We match the Outer Dial label to the Story 'subcategory'
    const categoryLabel = activeFilters.outer.label;
    
    return stories
      .filter((story) => 
        // Note: No need for (story: Story) in the filter argument when using .useMemo
        story.subcategory?.toLowerCase() === activeFilters.outer?.label.toLowerCase()
      )
      .slice(0, 3);
  }, [activeFilters.outer]);

  const handleConnect = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      
      portRef.current = port;
      setIsConnected(true);
      setStatus('Connected');
      
      const reader = port.readable.getReader();
      readerRef.current = reader;
      
      let buffer = '';
      
      // Read loop
      const readLoop = async () => {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            
            const text = new TextDecoder().decode(value);
            buffer += text;
            
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            lines.forEach(line => {
              line = line.trim();
              if (line) {
                try {
                  const data = JSON.parse(line);
                  if (data.potentiometer1 !== undefined && 
                      data.potentiometer2 !== undefined && 
                      data.potentiometer3 !== undefined) {
                    
                    setRawValues({
                      pot1: data.potentiometer1,
                      pot2: data.potentiometer2,
                      pot3: data.potentiometer3
                    });
                    
                    // Map to angles and update state
                    setOuterAngle(mapToAngle(data.potentiometer1));
                    setMiddleAngle(mapToAngle(data.potentiometer2));
                    setInnerAngle(mapToAngle(data.potentiometer3));
                  }
                } catch (e) {
                  console.log('Parse error:', e);
                }
              }
            });
          }
        } catch (error) {
          console.error('Read error:', error);
          setStatus('Error: ' + (error as Error).message);
        }
      };
      
      readLoop();
      
    } catch (error) {
      console.error('Connection error:', error);
      setStatus('Error: ' + (error as Error).message);
      setIsConnected(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
        readerRef.current.releaseLock();
      }
      if (portRef.current) {
        await portRef.current.close();
      }
      
      setIsConnected(false);
      setStatus('Disconnected');
      setOuterAngle(0);
      setMiddleAngle(0);
      setInnerAngle(0);
      setRawValues({ pot1: 0, pot2: 0, pot3: 0 });
    } catch (error) {
      console.error('Disconnect error:', error);
      setStatus('Disconnected (with errors)');
      setIsConnected(false);
    }
  };

  const handleCenterDotClick = () => {
    if (isConnected) {
      handleDisconnect();
    } else {
      handleConnect();
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Backdrop overlay when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-40 transition-opacity duration-300"
          style={{
            backgroundColor: '#000000cc',
          }}
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Dial container */}
      <div
        className={`fixed z-50 transition-all duration-500 ease-in-out cursor-pointer ${
          isExpanded ? 'dial-final-pos' : 'dial-init-pos'
        }`}
        style={{
          // width: '100%',
          // height: '100%',
          // backgroundColor: '#000'
        }}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <RadioDial 
          externalOuterAngle={outerAngle}
          externalMiddleAngle={middleAngle}
          externalInnerAngle={innerAngle}
          isConnected={isConnected}
          onCenterDotClick={handleCenterDotClick}
          onFilterChange={setActiveFilters}
        />
      </div>

      {/* [NEW] Content Display Area */}
      {isExpanded && activeFilters.outer && (
        <div className={`fixed z-50 transition-all duration-500 ease-in-out cursor-pointer stories-outer-container`}>
          {displayStories.map((story) => (
            <div 
              key={story.id} 
              className="story-card"
            >
              {/* <div className="story-slug">
                {story.collectionNames}
              </div> */}

              <div className="story-category">
                {story.category} • {story.subcategory}
              </div>

              <h3 className="story-headline">
                {story.title}
              </h3>

              <div 
                className="story-teaser" 
                dangerouslySetInnerHTML={{__html: story.text}} 
              />
              </div>
          ))}
          
          {displayStories.length === 0 && (
            <div className="text-center text-white/70 mt-4">
              No stories found for "{activeFilters.outer.label}"
            </div>
          )}
        </div>
      )}

    </div> // Closing main App div
  );
}
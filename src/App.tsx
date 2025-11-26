/// <reference path="./serial.d.ts" />
import React, { useState, useRef } from 'react';
import { RadioDial } from './components/RadioDial';

export default function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('Disconnected');
  const [outerAngle, setOuterAngle] = useState(0);
  const [middleAngle, setMiddleAngle] = useState(0);
  const [innerAngle, setInnerAngle] = useState(0);
  const [rawValues, setRawValues] = useState({ pot1: 0, pot2: 0, pot3: 0 });
  
  const portRef = useRef<SerialPort | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const isReadingRef = useRef(false); // Prevent multiple read loops

  const mapToAngle = (value: number) => {
    return (value / 1023) * 360 - 180;
  };

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
            backgroundColor: '#00000099',
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
        />
      </div>
    </div>
  );
}
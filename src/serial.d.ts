// Web Serial API type definitions
declare global {
  interface SerialPort extends EventTarget {
    readonly readable: ReadableStream<Uint8Array>;
    readonly writable: WritableStream<Uint8Array>;
    open(options: SerialOptions): Promise<void>;
    close(): Promise<void>;
  }

  interface SerialOptions {
    baudRate: number;
    dataBits?: number;
    stopBits?: number;
    parity?: 'none' | 'even' | 'odd';
    bufferSize?: number;
    flowControl?: 'none' | 'hardware';
  }

  interface SerialPortRequestOptions {
    filters?: SerialPortFilter[];
  }

  interface SerialPortFilter {
    usbVendorId?: number;
    usbProductId?: number;
  }

  interface Navigator {
    serial: {
      requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>;
      getPorts(): Promise<SerialPort[]>;
    };
  }
}

export {};


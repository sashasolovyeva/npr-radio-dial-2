export interface DialOption {
  label: string;
  angle: number;
}

export interface DialData {
  outer: DialOption[];
  middle: DialOption[];
  inner: DialOption[];
}

export const dialData: DialData = {
  outer: [
    { label: 'keep me engaged', angle: 90 },
    { label: 'update me', angle: 45 },
    { label: 'educate me', angle: 0 },
    { label: 'give me perspective', angle: -45 },
    { label: 'divert me', angle: -90 },
    { label: 'inspire me', angle: -135 },
    { label: 'connect me', angle: -180 },
    { label: 'help me', angle: 135 },
  ],
  middle: [], // To be populated later
  inner: [], // To be populated later
};

// Helper function to get the active option based on angle
export const getActiveOption = (angle: number, options: DialOption[]): DialOption | null => {
  if (options.length === 0) return null;
  
  // Normalize angle to 0-360 range
  const normalizedAngle = ((angle % 360) + 360) % 360;
  
  // Calculate segment size
  const segmentSize = 360 / options.length;

  const startingAngleOffset = 0;
  const adjustedAngle = ((normalizedAngle - startingAngleOffset) + 360) % 360;
  
  // Find which segment the angle falls into
  let segmentIndex = Math.floor((segmentSize/2 + adjustedAngle) / segmentSize);
  
  // Handle edge case where angle is exactly 360 (or very close)
  if (segmentIndex >= options.length) {
    segmentIndex = 0;
  }
  
  return options[segmentIndex];
};


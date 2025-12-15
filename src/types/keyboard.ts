export interface KeyData {
  row: number;
  col: number;
  // Support multiple layers, though we might only use layer 0 for now
  keyValue: number[]; 
  
  // Performance Data
  travel: number;
  isRT: boolean;
  rtTravel: number;
  rtPress: number;
  rtRelease: number;
  topDeadZone: number;
  bottomDeadZone: number;
  pressDeadZone: number;
  releaseDeadZone: number;
  axis: number; // Axis ID
  
  // Runtime State
  realTimeTravel: number;
  keyTriggerState: number;
}

export interface AxisInfo {
  id: number;
  name: string;
  minTravel: number;
  maxTravel: number;
  // Add more fields if needed
}


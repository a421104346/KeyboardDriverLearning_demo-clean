export interface KeyTravelData {
  keyId: string; // "row-col"
  keyName: string; // Not strictly needed if mapped by UI, but helpful
  currentTravel: number;    // 0-4.0 (mm) or 0-100 (%)
  isPressed: boolean;
  triggerPoint?: number;
}

export interface KeyTestState {
  enabled: boolean;
  data: Map<string, KeyTravelData>;
  lastUpdate: number;
}


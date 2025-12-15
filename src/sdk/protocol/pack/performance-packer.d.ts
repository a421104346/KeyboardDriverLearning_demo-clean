import { KeyInfo } from '../types/interface';
export declare class PerformancePacker {
    getPrecisionPacket: () => Uint8Array;
    getSupportAxisPacket: () => Uint8Array;
    getKeyPerformancePacket: (row: number, col: number) => Uint8Array;
    setKeyPerformancePacket: (row: number, col: number, data: KeyInfo) => Uint8Array;
}

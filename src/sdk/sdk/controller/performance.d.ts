import { Device } from '../device';
import { KeyInfo } from '../../protocol/types/interface';
export declare class PerformanceController {
    private device;
    private performancePacker;
    private performanceUnpacker;
    constructor(device: Device);
    getPrecision: () => Promise<{
        precision: number;
    }>;
    getSupportAxis: () => Promise<{
        axisCount: number;
        axisList: number[];
    }>;
    getKeyPerformance: (row: number, col: number) => Promise<KeyInfo>;
    setKeyPerformance: (row: number, col: number, data: KeyInfo) => Promise<{
        row: number;
        col: number;
        travel: number;
        isRT: boolean;
        rtTravel: number;
        rtPress: number;
        rtRelease: number;
        topDeadZone: number;
        bottomDeadZone: number;
        pressDeadZone: number;
        releaseDeadZone: number;
        axis: number;
    }>;
}

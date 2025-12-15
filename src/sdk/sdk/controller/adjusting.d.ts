import { Device } from '../device';
export declare class AdjustingController {
    private device;
    private adjustingPacker;
    private adjustingUnpacker;
    constructor(device: Device);
    startAdjusting: () => Promise<boolean>;
    finishAdjusting: () => Promise<boolean>;
    getAdjustingADC: (rows: number, cols: number) => Promise<number[][]>;
    getRealTimeTravel: (rows: number, cols: number) => Promise<number[][]>;
    getKeyTriggerState: (rows: number, cols: number) => Promise<number[][]>;
    getAdjustingSuccess: (rows: number, cols: number) => Promise<number[][]>;
    getAdjustingADCMax: (rows: number, cols: number) => Promise<number[][]>;
    getAdjustingADCMin: (rows: number, cols: number) => Promise<number[][]>;
}

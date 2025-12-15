import { Device } from '../device';
export declare class KeyController {
    private device;
    private keyPacker;
    private keyUnpacker;
    constructor(device: Device);
    getLayout: (fn: number, rows: number, cols: number) => Promise<number[][]>;
    setKey: (fn: number, row: number, col: number, keyValue: number) => Promise<boolean>;
}

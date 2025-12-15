import { Device } from '../device';
export declare class UpdateController {
    private device;
    private updatePacker;
    private updateUnpacker;
    constructor(device: Device);
    enterBoot: () => Promise<boolean>;
    update: (binData: Uint8Array) => Promise<boolean>;
    check: () => Promise<boolean>;
    upgrade: (binData: Uint8Array, callBack: (progress: number, updateStatus: string) => void) => Promise<boolean>;
    jumpApp: () => Promise<boolean>;
}

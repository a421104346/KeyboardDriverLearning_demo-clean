import { Emit } from '../../hid/xj_hid/emit';
import { HIDOptions } from '../../hid';
export declare class Device extends Emit {
    private hid;
    constructor(options: HIDOptions);
    getDevices: () => Promise<import("../../hid/xj_hid/types/types").XJHIDDevice[]>;
    connectDevice: (id: string) => Promise<boolean>;
    disconnectDevice: () => Promise<void>;
    sendMessage: (packet: Uint8Array) => Promise<any>;
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback: (...args: any[]) => void): void;
}

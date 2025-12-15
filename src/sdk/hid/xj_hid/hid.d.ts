import { HIDOptions, XJHIDDevice, HIDDevice } from './types/types';
import { Emit } from './emit';
export declare class XJ_HID extends Emit {
    private currentDevice;
    private deviceList;
    private filters;
    private maxRetries;
    private timeout;
    private requestDeviceStatus;
    private messageQueue;
    private com_uuid;
    constructor(options: HIDOptions);
    getAuthorizedDevices(): Promise<HIDDevice[]>;
    requestDevice(): Promise<HIDDevice | null>;
    getDevices(): Promise<XJHIDDevice[]>;
    connectDevice(id: string): Promise<boolean>;
    disconnectDevice(): Promise<void>;
    sendRequest(packet: Uint8Array, timeout?: number): Promise<any>;
    private setupInputListener;
    private setupDeviceInsertListener;
    private setupDeviceRemoveListener;
    private updateRequestDeviceStatus;
}
export default XJ_HID;

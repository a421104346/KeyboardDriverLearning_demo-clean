import { DeviceInfo } from '../types/interface';
export declare class SystemUnpacker {
    unpackDeviceInfo: (data: Uint8Array) => DeviceInfo;
    unpackLockWin: (data: Uint8Array) => boolean;
    unpackAllKeyLock: (data: Uint8Array) => boolean;
    unpackRtSwitch: (data: Uint8Array) => boolean;
    unpackReportRate: (data: Uint8Array) => number;
    unpackConfig: (data: Uint8Array) => number;
    unpackSystem: (data: Uint8Array) => "WIN" | "MAC";
}

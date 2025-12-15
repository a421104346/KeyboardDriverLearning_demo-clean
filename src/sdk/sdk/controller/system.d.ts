import { Device } from '../device';
import { Profile, LockWinSubCommand, AllKeyLockSubCommand, RT_SWITCH_SUB_Command } from '../../protocol/types/enum';
export declare class SystemController {
    private device;
    private systemPacker;
    private systemUnpacker;
    constructor(device: Device);
    getDeviceInfo: () => Promise<import("../../protocol/types/interface").DeviceInfo>;
    restoreFactorySettings: (profiles: Profile[]) => Promise<any>;
    getLockWin: () => Promise<boolean>;
    setLockWin: (lockWin: LockWinSubCommand) => Promise<any>;
    getAllKeyLock: () => Promise<boolean>;
    setAllKeyLock: (allKeyLock: AllKeyLockSubCommand) => Promise<any>;
    getRtSwitch: () => Promise<boolean>;
    setRtSwitch: (rtSwitch: RT_SWITCH_SUB_Command) => Promise<any>;
    getReportRate: () => Promise<number>;
    setReportRate: (reportRate: number) => Promise<any>;
    getConfig: () => Promise<number>;
    setConfig: (config: number) => Promise<any>;
    getSystem: () => Promise<"WIN" | "MAC">;
    setSystem: (system: number) => Promise<any>;
}

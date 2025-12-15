import { Profile, LockWinSubCommand, AllKeyLockSubCommand, RT_SWITCH_SUB_Command } from '../types/enum';
export declare class SystemPacker {
    getDeviceInfoPacket: () => Uint8Array;
    restoreFactorySettingsPacket: (profiles: Profile[]) => Uint8Array;
    getLockWinPacket: () => Uint8Array;
    setLockWinPacket: (lockWin: LockWinSubCommand) => Uint8Array;
    getAllKeyLockPacket: () => Uint8Array;
    setAllKeyLockPacket: (allKeyLock: AllKeyLockSubCommand) => Uint8Array;
    getRtSwitchPacket: () => Uint8Array;
    setRtSwitchPacket: (rtSwitch: RT_SWITCH_SUB_Command) => Uint8Array;
    getReportRatePacket: () => Uint8Array;
    setReportRatePacket: (reportRate: number) => Uint8Array;
    getConfigPacket: () => Uint8Array;
    setConfigPacket: (config: number) => Uint8Array;
    getSystemPacket: () => Uint8Array;
    setSystemPacket: (system: number) => Uint8Array;
}

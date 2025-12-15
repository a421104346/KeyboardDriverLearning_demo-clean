import { Emit } from '@/hid/xj_hid/emit';
import { Profile, LockWinSubCommand, AllKeyLockSubCommand, RT_SWITCH_SUB_Command } from '@/protocol/types/enum';
import { LightAreaType } from '@/protocol/types/enum';
import { KeyInfo, LightConfigInfo, LightAreaRGBInfo, DKSInfo, MPTInfo, MTInfo, TGLInfo, ENDInfo, SOCDInfo, WEBInfo, MacroInfo, RGBInfo, EKInfo } from '@/protocol/types/interface';
export interface HLibOptions {
    filters: Array<{
        vendorId: number;
        productId: number;
        usage: number;
        usagePage: number;
    }>;
    debug?: boolean;
}
export declare class HSDK extends Emit {
    private device;
    private systemController;
    private updateController;
    private adjustingController;
    private performanceController;
    private keyController;
    private advancedKeyController;
    private macroController;
    private lightController;
    private reportProactivelyController;
    constructor(options: HLibOptions);
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback: (...args: any[]) => void): void;
    getDevices: () => Promise<import("../hid/xj_hid/types/types").XJHIDDevice[]>;
    connectDevice: (id: string) => Promise<boolean>;
    disconnectDevice: () => Promise<void>;
    sendMessage: (packet: Uint8Array) => Promise<any>;
    getDeviceInfo: () => Promise<import("@/protocol/types/interface").DeviceInfo>;
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
    enterBoot: () => Promise<boolean>;
    update: (binData: Uint8Array, callBack: (progress: number, updateStatus: string) => void) => Promise<boolean>;
    check: () => Promise<boolean>;
    crc: (data: Uint8Array) => number;
    jumpApp: () => Promise<boolean>;
    startAdjusting: () => Promise<boolean>;
    finishAdjusting: () => Promise<boolean>;
    getAdjustingADC: (rows: number, cols: number) => Promise<number[][]>;
    getAdjustingADCMax: (rows: number, cols: number) => Promise<number[][]>;
    getAdjustingADCMin: (rows: number, cols: number) => Promise<number[][]>;
    getRealTimeTravel: (rows: number, cols: number) => Promise<number[][]>;
    getKeyTriggerState: (rows: number, cols: number) => Promise<number[][]>;
    getAdjustingSuccess: (rows: number, cols: number) => Promise<number[][]>;
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
    getLayout: (fn: number, rows: number, cols: number) => Promise<number[][]>;
    setKey: (fn: number, row: number, col: number, keyValue: number) => Promise<boolean>;
    getKeyAdvancedKeyInfo: (row: number, col: number) => Promise<{
        advancedKeyType: string;
        dks: {
            triggerTravel: number[];
            keyValue: number[];
        };
        mpt?: undefined;
        mt?: undefined;
        tgl?: undefined;
        end?: undefined;
        socd?: undefined;
        web?: undefined;
        ek?: undefined;
    } | {
        advancedKeyType: string;
        mpt: {
            triggerTravel: number[];
            keyValue: number[];
        };
        dks?: undefined;
        mt?: undefined;
        tgl?: undefined;
        end?: undefined;
        socd?: undefined;
        web?: undefined;
        ek?: undefined;
    } | {
        advancedKeyType: string;
        mt: {
            keyValue: number[];
            time: number;
        };
        dks?: undefined;
        mpt?: undefined;
        tgl?: undefined;
        end?: undefined;
        socd?: undefined;
        web?: undefined;
        ek?: undefined;
    } | {
        advancedKeyType: string;
        tgl: {
            keyValue: number;
            time: number;
        };
        dks?: undefined;
        mpt?: undefined;
        mt?: undefined;
        end?: undefined;
        socd?: undefined;
        web?: undefined;
        ek?: undefined;
    } | {
        advancedKeyType: string;
        end: {
            keyValue: number[];
            delay: number;
        };
        dks?: undefined;
        mpt?: undefined;
        mt?: undefined;
        tgl?: undefined;
        socd?: undefined;
        web?: undefined;
        ek?: undefined;
    } | {
        advancedKeyType: string;
        socd: {
            position: {
                row: number;
                col: number;
            }[];
            keyValue: number[];
            mode: number;
            delayTime: number;
        };
        dks?: undefined;
        mpt?: undefined;
        mt?: undefined;
        tgl?: undefined;
        end?: undefined;
        web?: undefined;
        ek?: undefined;
    } | {
        advancedKeyType: string;
        web: {
            length: number;
            web: string;
        };
        dks?: undefined;
        mpt?: undefined;
        mt?: undefined;
        tgl?: undefined;
        end?: undefined;
        socd?: undefined;
        ek?: undefined;
    } | {
        advancedKeyType: string;
        ek: {
            specialKey: number[];
            normalKey: number;
        };
        dks?: undefined;
        mpt?: undefined;
        mt?: undefined;
        tgl?: undefined;
        end?: undefined;
        socd?: undefined;
        web?: undefined;
    } | {
        advancedKeyType: string;
        dks?: undefined;
        mpt?: undefined;
        mt?: undefined;
        tgl?: undefined;
        end?: undefined;
        socd?: undefined;
        web?: undefined;
        ek?: undefined;
    }>;
    setKeyAdvancedDKS: (row: number, col: number, dks: DKSInfo) => Promise<boolean>;
    setKeyAdvancedMPT: (row: number, col: number, mpt: MPTInfo) => Promise<boolean>;
    setKeyAdvancedMT: (row: number, col: number, mt: MTInfo) => Promise<boolean>;
    setKeyAdvancedTGL: (row: number, col: number, tgl: TGLInfo) => Promise<boolean>;
    setKeyAdvancedEND: (row: number, col: number, end: ENDInfo) => Promise<boolean>;
    setKeyAdvancedSOCD: (row: number, col: number, socd: SOCDInfo) => Promise<boolean>;
    setKeyAdvancedWEB: (row: number, col: number, web: WEBInfo) => Promise<boolean>;
    setKeyAdvancedEK: (row: number, col: number, ek: EKInfo) => Promise<boolean>;
    deleteKeyAdvanced: (row: number, col: number) => Promise<{
        fn: number;
        row: number;
        col: number;
        keyValue: number;
    }>;
    getMacro: (index: number) => Promise<{
        macroMode: {
            macroID: number;
            macroMode: number;
            loopCount: number;
            stepCount: number;
            delayTime: number;
        };
        macroStep: import("@/protocol/types/interface").MacroStep[];
    }>;
    setMacro: (index: number, macro: MacroInfo) => Promise<{
        setModeRet: {
            macroID: number;
            macroMode: number;
            loopCount: number;
            stepCount: number;
            delayTime: number;
        };
    }>;
    getLightArea: () => Promise<import("@/protocol/types/interface").LightAreaSizeInfo[] | undefined>;
    getLightConfigInfo: (area: LightAreaType) => Promise<{
        areaID: number;
        powerSwitch: boolean;
        mode: number;
        open: boolean;
        direction: number;
        brightness: number;
        speed: number;
        sleepTime: number;
        powerSwitch2: boolean;
    }>;
    setLightConfigInfo: (data: LightConfigInfo) => Promise<{
        areaID: number;
        powerSwitch: boolean;
        mode: number;
        open: boolean;
        direction: number;
        brightness: number;
        speed: number;
        sleepTime: number;
        powerSwitch2: boolean;
    }>;
    getColorID: (area: LightAreaType) => Promise<{
        areaID: number;
        colorID: number;
    }>;
    setColorID: (area: LightAreaType, colorID: number) => Promise<{
        areaID: number;
        colorID: number;
    }>;
    getColorPanel: (area: LightAreaType) => Promise<{
        areaID: number;
        colorList: RGBInfo[];
    }>;
    setColorPanel: (area: LightAreaType, panel: RGBInfo[]) => Promise<{
        areaID: number;
        colorList: RGBInfo[];
    }>;
    getLightAreaRGB: (area: LightAreaType, data: LightAreaRGBInfo[]) => Promise<LightAreaRGBInfo[]>;
    setLightAreaRGB: (area: LightAreaType, data: LightAreaRGBInfo[]) => Promise<LightAreaRGBInfo[]>;
    dynamicLightEffectSync: (area: LightAreaType, data: LightAreaRGBInfo[]) => Promise<LightAreaRGBInfo[]>;
    isLightKey: (keyValue: number) => boolean;
    private _printWelcomeMessage;
    getVersion(): string;
    getInfo(): {
        name: string;
        version: string;
        description: string;
        author: string;
    };
}

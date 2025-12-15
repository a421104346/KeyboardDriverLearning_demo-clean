import { Device } from '../device';
import { DKSInfo, MPTInfo, MTInfo, TGLInfo, ENDInfo, SOCDInfo, WEBInfo, EKInfo } from '../../protocol/types/interface';
export declare class AdvancedKeyController {
    private device;
    private advancedKeyPacker;
    private advancedKeyUnpacker;
    constructor(device: Device);
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
}

import { DKSInfo, MPTInfo, MTInfo, TGLInfo, ENDInfo, SOCDInfo, WEBInfo, EKInfo } from '../types/interface';
export declare class AdvancedKeyPacker {
    getKeyAdvancedKeyInfoPacket: (fn: number, row: number, col: number) => Uint8Array;
    setKeyAdvancedDKSPacket: (fn: number, row: number, col: number, dks: DKSInfo) => Uint8Array;
    setKeyAdvancedMPTPacket: (fn: number, row: number, col: number, mpt: MPTInfo) => Uint8Array;
    setKeyAdvancedMTPacket: (fn: number, row: number, col: number, mt: MTInfo) => Uint8Array;
    setKeyAdvancedTGLPacket: (fn: number, row: number, col: number, tgl: TGLInfo) => Uint8Array;
    setKeyAdvancedENDPacket: (fn: number, row: number, col: number, end: ENDInfo) => Uint8Array;
    setKeyAdvancedSOCDPacket: (fn: number, row: number, col: number, socd: SOCDInfo) => Uint8Array;
    setKeyAdvancedWEBPacket: (fn: number, row: number, col: number, web: WEBInfo) => Uint8Array;
    setKeyAdvancedEKPacket: (fn: number, row: number, col: number, info: EKInfo) => Uint8Array;
    deleteKeyAdvancedPacket: (fn: number, row: number, col: number) => Uint8Array;
}

import { MacroInfo, MacroStep } from '../types/interface';
export declare class MacroPacker {
    getMacroModePacket: (index: number) => Uint8Array;
    setMacroModePacket: (index: number, macro: MacroInfo) => Uint8Array;
    getMacroStepPacket: (index: number, packID: number) => Uint8Array;
    setMacroStepPacket: (index: number, packID: number, step: MacroStep[]) => Uint8Array;
}

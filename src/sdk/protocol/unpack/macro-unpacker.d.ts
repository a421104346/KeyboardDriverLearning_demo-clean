import { MacroStep } from '../types/interface';
export declare class MacroUnpacker {
    unpackMacroMode: (data: Uint8Array) => {
        macroID: number;
        macroMode: number;
        loopCount: number;
        stepCount: number;
        delayTime: number;
    };
    unpackMacroStep: (data: Uint8Array, stepCount: number) => {
        macroID: number;
        packID: number;
        macroStep: MacroStep[];
    };
}

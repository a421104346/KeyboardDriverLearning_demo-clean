import { Device } from '../device';
import { MacroInfo, MacroStep } from '../../protocol/types/interface';
export declare class MacroController {
    private device;
    private macroPacker;
    private macroUnpacker;
    constructor(device: Device);
    getMacroMode: (index: number) => Promise<{
        macroID: number;
        macroMode: number;
        loopCount: number;
        stepCount: number;
        delayTime: number;
    }>;
    setMacroMode: (index: number, macro: MacroInfo) => Promise<{
        macroID: number;
        macroMode: number;
        loopCount: number;
        stepCount: number;
        delayTime: number;
    }>;
    getMacroStep: (index: number, packID: number) => Promise<{
        macroID: number;
        packID: number;
        macroStep: MacroStep[];
    }>;
    setMacroStep: (index: number, packID: number, step: MacroStep[]) => Promise<{
        macroID: number;
        packID: number;
        macroStep: MacroStep[];
    }>;
    getMacro: (index: number) => Promise<{
        macroMode: {
            macroID: number;
            macroMode: number;
            loopCount: number;
            stepCount: number;
            delayTime: number;
        };
        macroStep: MacroStep[];
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
}

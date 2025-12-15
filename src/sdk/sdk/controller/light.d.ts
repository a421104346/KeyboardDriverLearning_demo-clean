import { Device } from '../device';
import { LightAreaType } from '../../protocol/types/enum';
import { RGBInfo, LightConfigInfo, LightAreaRGBInfo } from '../../protocol/types/interface';
export declare class LightController {
    private device;
    private lightPacker;
    private lightUnpacker;
    constructor(device: Device);
    getLightArea: () => Promise<import("../../protocol/types/interface").LightAreaSizeInfo[] | undefined>;
    getLightConfig: (type: LightAreaType) => Promise<{
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
    setLightConfig: (data: LightConfigInfo) => Promise<{
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
}

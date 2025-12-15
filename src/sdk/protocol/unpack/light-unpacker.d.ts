import { LightAreaSizeInfo, RGBInfo, LightAreaRGBInfo } from '../types/interface';
export declare class LightUnpacker {
    unpackLightArea: (data: Uint8Array) => LightAreaSizeInfo[] | undefined;
    unpackLightConfig: (data: Uint8Array) => {
        areaID: number;
        powerSwitch: boolean;
        mode: number;
        open: boolean;
        direction: number;
        brightness: number;
        speed: number;
        sleepTime: number;
        powerSwitch2: boolean;
    };
    unpackColorID: (data: Uint8Array) => {
        areaID: number;
        colorID: number;
    };
    unpackColorPanel: (data: Uint8Array) => {
        areaID: number;
        colorList: RGBInfo[];
    };
    unpackLightAreaRGB: (data: Uint8Array) => {
        areaID: number;
        rgbList: LightAreaRGBInfo[];
    };
}

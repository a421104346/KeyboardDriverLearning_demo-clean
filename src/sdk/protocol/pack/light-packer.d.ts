import { LightAreaType } from '../types/enum';
import { LightConfigInfo, RGBInfo, LightAreaRGBInfo } from '../types/interface';
export declare class LightPacker {
    getLightAreaPacket: () => Uint8Array;
    getLightConfigPacket: (area: LightAreaType) => Uint8Array;
    setLightConfigPacket: (data: LightConfigInfo) => Uint8Array;
    getColorIDPacket: (area: LightAreaType) => Uint8Array;
    setColorIDPacket: (area: LightAreaType, colorID: number) => Uint8Array;
    getColorPanelPacket: (area: LightAreaType) => Uint8Array;
    setColorPanelPacket: (area: LightAreaType, panel: RGBInfo[]) => Uint8Array;
    getLightAreaRGBPacket: (area: LightAreaType, data: LightAreaRGBInfo[]) => Uint8Array;
    setLightAreaRGBPacket: (area: LightAreaType, data: LightAreaRGBInfo[]) => Uint8Array;
    dynamicLightEffectSyncPacket: (area: LightAreaType, data: LightAreaRGBInfo[]) => Uint8Array;
}

import { LightAreaType } from './enum';
export interface DeviceInfo {
    boardID: string;
    keyboardSN: string;
    runMode: number;
    fwVersion: string;
    protocolVersion: string;
    layoutCount?: number;
    row?: number;
    col?: number;
    layoutID?: number;
    profileCount?: number;
    connectMode?: number;
}
export interface RGBInfo {
    r: number;
    g: number;
    b: number;
}
export interface Position {
    row: number;
    col: number;
}
export interface LightAreaSizeInfo {
    areaID: LightAreaType;
    row: number;
    col: number;
    powerCount: number;
}
export interface LightConfigInfo {
    areaID: LightAreaType;
    powerSwitch: boolean;
    mode: number;
    open: boolean;
    direction: number;
    brightness: number;
    speed: number;
    sleepTime: number;
    powerSwitch2?: boolean;
}
export interface ColorPanelInfo {
    areaID: LightAreaType;
    colorList: RGBInfo[];
}
export interface LightAreaRGBInfo {
    position: Position;
    rgb: RGBInfo;
}
export interface LightSingleInfo {
    areaID: LightAreaType;
    row: number;
    col: number;
    red: number;
    green: number;
    blue: number;
}
export interface KeyInfo {
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
}
export interface DKSInfo {
    triggerTravel: number[];
    keyValue: number[];
}
export interface MPTInfo {
    triggerTravel: number[];
    keyValue: number[];
}
export interface MTInfo {
    keyValue: number[];
    time: number;
}
export interface TGLInfo {
    keyValue: number;
    time: number;
}
export interface ENDInfo {
    keyValue: number[];
    delay: number;
}
export interface SOCDInfo {
    position: Position[];
    keyValue: number[];
    mode: number;
    delayTime: number;
}
export interface WEBInfo {
    length: number;
    web: string;
}
export interface MacroStep {
    keyValue: number;
    status: number;
    time: number;
}
export interface MacroInfo {
    macroID: number;
    macroMode: number;
    loopCount: number;
    delayTime: number;
    stepCount: number;
    macroStep: MacroStep[];
}
export interface EKInfo {
    specialKey: number[];
    normalKey: number;
}

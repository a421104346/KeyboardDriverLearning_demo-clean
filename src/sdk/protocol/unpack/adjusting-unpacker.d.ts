export declare class AdjustingUnpacker {
    unpackAdjustingADC: (data: Uint8Array, cols: number) => {
        row: number;
        adcList: number[];
    };
    unpackRealTimeTravel: (data: Uint8Array, cols: number) => {
        row: number;
        travelList: number[];
    };
    unpackKeyTriggerState: (data: Uint8Array, cols: number) => {
        row: number;
        triggerStateList: number[];
    };
    unpackAdjustingSuccess: (data: Uint8Array, cols: number) => {
        row: number;
        adjustingSuccessList: number[];
    };
    unpackAdjustingADCMax: (data: Uint8Array, cols: number) => {
        row: number;
        adcMaxList: number[];
    };
    unpackAdjustingADCMin: (data: Uint8Array, cols: number) => {
        row: number;
        adcMinList: number[];
    };
}

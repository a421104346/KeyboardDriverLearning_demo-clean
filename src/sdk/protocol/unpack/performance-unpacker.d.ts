export declare class PerformanceUnpacker {
    unpackPrecision: (data: Uint8Array) => {
        precision: number;
    };
    unpackSupportAxis: (data: Uint8Array) => {
        axisCount: number;
        axisList: number[];
    };
    unpackKeyPerformance: (data: Uint8Array) => {
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
    };
}

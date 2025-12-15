export declare class AdjustingPacker {
    getStartAdjustingPacket: () => Uint8Array;
    getFinishAdjustingPacket: () => Uint8Array;
    getAdjustingADCPacket: (row: number) => Uint8Array;
    getRealTimeTravelPacket: (row: number) => Uint8Array;
    getKeyTriggerStatePacket: (row: number) => Uint8Array;
    getAdjustingSuccessPacket: (row: number) => Uint8Array;
    getAdjustingADCMaxPacket: (row: number) => Uint8Array;
    getAdjustingADCMinPacket: (row: number) => Uint8Array;
}

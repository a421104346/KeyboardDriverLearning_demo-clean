export declare class UpdatePacker {
    enterBootPacket: () => Uint8Array;
    updatePacket: (binData: Uint8Array) => Uint8Array;
    checkPacket: () => Uint8Array;
    jumpAppPacket: () => Uint8Array;
}

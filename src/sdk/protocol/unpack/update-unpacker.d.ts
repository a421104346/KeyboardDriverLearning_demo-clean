export declare class UpdateUnpacker {
    unpackEnterBoot: (data: Uint8Array) => boolean;
    unpackUpdate: (data: Uint8Array) => boolean;
    unpackCheck: (data: Uint8Array) => boolean;
    unpackJumpApp: (data: Uint8Array) => boolean;
}

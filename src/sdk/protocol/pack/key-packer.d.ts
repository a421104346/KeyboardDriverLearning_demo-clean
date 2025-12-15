export declare class KeyPacker {
    getLayout: (fn: number, row: number) => Uint8Array;
    setKey: (fn: number, row: number, col: number, keyValue: number) => Uint8Array;
    setCombinedKey: (fn: number, row: number, col: number, keyValue: number) => Uint8Array;
}

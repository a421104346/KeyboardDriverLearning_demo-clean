export * from './byteTool';
export declare const delay: (ms: number) => Promise<unknown>;
export declare const posToCoord: (pos: number) => {
    row: number;
    col: number;
};

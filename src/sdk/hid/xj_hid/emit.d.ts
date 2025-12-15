type EventHandler = (...args: any[]) => void;
export declare class Emit {
    private eventMap;
    on(event: string, handler: EventHandler): void;
    emit(event: string, ...args: any[]): void;
    off(event: string, handler: EventHandler): void;
}
export {};

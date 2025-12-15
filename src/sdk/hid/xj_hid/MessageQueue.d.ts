export interface MessageTask {
    id: string;
    message: Uint8Array;
    resolve: (data: any) => void;
    reject: (err: any) => void;
    timeoutId: any;
    type: string;
    timestamp: number;
}
export declare class MessageQueue {
    private queue;
    addMessage(task: MessageTask): void;
    getMessageById(id: string): MessageTask | undefined;
    getMessageByType(type: string, timestamp: number): MessageTask | undefined;
    removeMessageById(id: string): void;
    shiftMessage(): MessageTask | undefined;
    isEmpty(): boolean;
    getMessageType(data: Uint8Array): string;
    clearMessageByTimestamp(ms: number): void;
}

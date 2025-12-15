export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export declare const LOG_LEVELS: {
    readonly DEBUG: 0;
    readonly INFO: 1;
    readonly WARN: 2;
    readonly ERROR: 3;
};
export declare const LEVEL_NAMES: {
    readonly 0: "DEBUG";
    readonly 1: "INFO";
    readonly 2: "WARN";
    readonly 3: "ERROR";
};
export interface LogEntry {
    level: number;
    levelName: string;
    message: string;
    data: any;
    timestamp: string;
    formatted: string;
}
export declare class Logger {
    name: string;
    level: number;
    logs: LogEntry[];
    constructor(name?: string, level?: number);
    private formatMessage;
    private recordLog;
    debug(message: string, data?: any): LogEntry | undefined;
    info(message: string, data?: any): LogEntry | undefined;
    warn(message: string, data?: any): LogEntry | undefined;
    error(message: string, data?: any): LogEntry | undefined;
    getLogs(): LogEntry[];
}
declare const _default: Logger;
export default _default;

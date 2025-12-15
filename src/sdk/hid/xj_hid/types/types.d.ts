export interface HIDOptions {
    filters: Array<{
        vendorId: number;
        productId: number;
        usage: number;
        usagePage: number;
    }>;
    maxRetries?: number;
    timeout?: number;
}
export interface XJHIDDevice {
    id: string;
    device: HIDDevice;
}
export interface HIDDevice {
    readonly opened: boolean;
    readonly vendorId: number;
    readonly productId: number;
    readonly productName: string;
    readonly collections: HIDCollection[];
    open(): Promise<void>;
    close(): Promise<void>;
    sendReport(reportId: number, data: BufferSource): Promise<void>;
    sendFeatureReport(reportId: number, data: BufferSource): Promise<void>;
    receiveFeatureReport(reportId: number): Promise<DataView>;
    forget(): Promise<void>;
    oninputreport: ((this: this, event: HIDInputReportEvent) => void) | null;
    addEventListener(type: "inputreport", listener: (event: HIDInputReportEvent) => void, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: "inputreport", listener: (event: HIDInputReportEvent) => void, options?: boolean | EventListenerOptions): void;
}
interface HIDCollection {
    usagePage: number;
    usage: number;
    type: number;
    children: HIDCollection[];
}
interface HIDInputReportEvent extends Event {
    readonly device: HIDDevice;
    readonly reportId: number;
    readonly data: DataView;
}
export {};

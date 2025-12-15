import { Emit } from '../../hid/xj_hid/emit';
import { Device } from '../device';
export declare class ReportProactivelyController extends Emit {
    private device;
    private systemUnpacker;
    private lightUnpacker;
    constructor(device: Device);
    analysisReportProactively: (data: Uint8Array) => void;
}

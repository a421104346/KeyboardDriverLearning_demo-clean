export declare class AdvancedKeyUnpacker {
    unpackKeyAdvancedKeyInfo: (data: Uint8Array) => {
        advancedKeyType: string;
        dks: {
            triggerTravel: number[];
            keyValue: number[];
        };
        mpt?: undefined;
        mt?: undefined;
        tgl?: undefined;
        end?: undefined;
        socd?: undefined;
        web?: undefined;
        ek?: undefined;
    } | {
        advancedKeyType: string;
        mpt: {
            triggerTravel: number[];
            keyValue: number[];
        };
        dks?: undefined;
        mt?: undefined;
        tgl?: undefined;
        end?: undefined;
        socd?: undefined;
        web?: undefined;
        ek?: undefined;
    } | {
        advancedKeyType: string;
        mt: {
            keyValue: number[];
            time: number;
        };
        dks?: undefined;
        mpt?: undefined;
        tgl?: undefined;
        end?: undefined;
        socd?: undefined;
        web?: undefined;
        ek?: undefined;
    } | {
        advancedKeyType: string;
        tgl: {
            keyValue: number;
            time: number;
        };
        dks?: undefined;
        mpt?: undefined;
        mt?: undefined;
        end?: undefined;
        socd?: undefined;
        web?: undefined;
        ek?: undefined;
    } | {
        advancedKeyType: string;
        end: {
            keyValue: number[];
            delay: number;
        };
        dks?: undefined;
        mpt?: undefined;
        mt?: undefined;
        tgl?: undefined;
        socd?: undefined;
        web?: undefined;
        ek?: undefined;
    } | {
        advancedKeyType: string;
        socd: {
            position: {
                row: number;
                col: number;
            }[];
            keyValue: number[];
            mode: number;
            delayTime: number;
        };
        dks?: undefined;
        mpt?: undefined;
        mt?: undefined;
        tgl?: undefined;
        end?: undefined;
        web?: undefined;
        ek?: undefined;
    } | {
        advancedKeyType: string;
        web: {
            length: number;
            web: string;
        };
        dks?: undefined;
        mpt?: undefined;
        mt?: undefined;
        tgl?: undefined;
        end?: undefined;
        socd?: undefined;
        ek?: undefined;
    } | {
        advancedKeyType: string;
        ek: {
            specialKey: number[];
            normalKey: number;
        };
        dks?: undefined;
        mpt?: undefined;
        mt?: undefined;
        tgl?: undefined;
        end?: undefined;
        socd?: undefined;
        web?: undefined;
    } | {
        advancedKeyType: string;
        dks?: undefined;
        mpt?: undefined;
        mt?: undefined;
        tgl?: undefined;
        end?: undefined;
        socd?: undefined;
        web?: undefined;
        ek?: undefined;
    };
    unpackDKS: (data: Uint8Array) => {
        triggerTravel: number[];
        keyValue: number[];
    };
    unpackMPT: (data: Uint8Array) => {
        triggerTravel: number[];
        keyValue: number[];
    };
    unpackMT: (data: Uint8Array) => {
        keyValue: number[];
        time: number;
    };
    unpackTGL: (data: Uint8Array) => {
        keyValue: number;
        time: number;
    };
    unpackEND: (data: Uint8Array) => {
        keyValue: number[];
        delay: number;
    };
    unpackSOCD: (data: Uint8Array) => {
        position: {
            row: number;
            col: number;
        }[];
        keyValue: number[];
        mode: number;
        delayTime: number;
    };
    unpackWEB: (data: Uint8Array) => {
        length: number;
        web: string;
    };
    unpackEK: (data: Uint8Array) => {
        specialKey: number[];
        normalKey: number;
    };
    unpackDeleteAdvanced: (data: Uint8Array) => {
        fn: number;
        row: number;
        col: number;
        keyValue: number;
    };
}

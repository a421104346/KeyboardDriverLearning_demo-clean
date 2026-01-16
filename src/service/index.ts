import { createMockService } from './mockService';

const sdkEnabled = import.meta.env.VITE_SDK_ENABLED === 'true';
const sdkModule = (globalThis as any).__HSDK__;

const createRealService = () => {
  const HSDK = sdkModule?.HSDK ?? sdkModule;
  if (!HSDK) return null;
  return new HSDK({
    filters: [
      {
        usagePage: 0xff00,
        usage: 0x01,
        vendorId: 0x34b7,
        productId: 0xffff,
      },
    ],
  });
};

const service = sdkEnabled ? createRealService() ?? createMockService() : createMockService();

export const isPreviewMode = (service as any).__isMock === true;

export default service;


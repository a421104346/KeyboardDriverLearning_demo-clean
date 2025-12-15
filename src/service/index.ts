// @ts-ignore
import { HSDK } from '../sdk/index.js';

const service = new HSDK({
  filters: [
    {
      usagePage: 0xff00,
      usage: 0x01,
      vendorId: 0x34b7,
      productId: 0xffff,
    },
  ],
});

export default service;


export enum ErrorCode {
  DEVICE_NOT_FOUND = 'DEVICE_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  UNSUPPORTED_DEVICE = 'UNSUPPORTED_DEVICE',
  SDK_ERROR = 'SDK_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: string;
  timestamp: number;
}


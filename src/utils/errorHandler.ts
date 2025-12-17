import { ErrorCode } from '../types/error';

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.DEVICE_NOT_FOUND]: 'Device not found or not connected.',
  [ErrorCode.PERMISSION_DENIED]: 'Permission denied. Please allow WebHID access.',
  [ErrorCode.CONNECTION_FAILED]: 'Connection failed. Please reconnect the device.',
  [ErrorCode.UNSUPPORTED_DEVICE]: 'Unsupported device.',
  [ErrorCode.SDK_ERROR]: 'SDK Error occurred.',
  [ErrorCode.UNKNOWN]: 'An unknown error occurred.',
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return ERROR_MESSAGES[ErrorCode.UNKNOWN];
}


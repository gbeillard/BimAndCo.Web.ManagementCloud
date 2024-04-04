import { ErrorCode } from './types';

export const getErrorMessages = (resources: any) => ({
  [ErrorCode.IsRequired]: resources.BadRequest.IsRequired,
  [ErrorCode.DoesntExist]: resources.BadRequest.DoesntExist,
  [ErrorCode.AlreadyExist]: resources.BadRequest.AlreadyExist,
  [ErrorCode.DoesntMatch]: resources.BadRequest.DoesntMatch,
});

export const getErrorMessage = (resources: any, errorCode: ErrorCode) =>
  getErrorMessages(resources)[errorCode];

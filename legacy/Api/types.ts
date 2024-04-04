export type BadRequestImportExcel = {
  Detail: string;
  Errors: BadRequestError[];
  Extensions: Extensions;
  Instance: string;
  Status: number;
  Title: string;
  Type: string;
};

export type Extensions = {
  TraceId: string;
};

export type BadRequestError = {
  Code: ErrorCode;
  Details?: string;
  Message: string;
  Path: ErrorPath;
  TraceId: string;
};

export type ErrorPath = {
  Column: string;
  Line: number;
  Name: string;
  Reference: string;
  Sheet: string;
};

export enum ErrorCode {
  IsRequired = 1001,
  DoesntExist,
  AlreadyExist,
  DoesntMatch,
}

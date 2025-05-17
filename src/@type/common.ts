export interface Page {
  pageNum: number;
  pageSize: number;
}

export interface ResponsePage extends Page {
  totalPages: number;
  totalRecords: number;
}

export interface ResponseBase<T> {
  code: number;
  message: null | string;
  data?: T;
}

export interface ResponseList<T> extends ResponsePage, ResponseBase<T[]> {}

export type ResponseData<T = undefined> = ResponseBase<T>;

export interface ResponseError {
  errorCode: string;
  errorMsg: string;
  success: boolean;
  sysTime: number;
  data?: null;
}
export interface UploadResponse {
  id: string
  url: string
}

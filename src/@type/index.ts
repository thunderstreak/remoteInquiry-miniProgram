export interface AnyType<T = any> {
  [name: string]: T;
}

export interface RequestParams {
  headers?: AnyType;
  extras?: AnyType;

  [name: string]: any;
}

export type StorageType = 'localStorage' | 'sessionStorage';

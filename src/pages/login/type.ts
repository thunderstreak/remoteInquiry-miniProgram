import { Login } from '@/@type/request'

export interface LoginState {
  controlled: boolean;
  loading: boolean;
  videoShow: boolean;
  successShow: boolean;
  times: number;
  timer: any;
}

export interface FormData extends Login {}

export enum PlatformTypes {
  '远程取证' = 'evidence',
  '交警云执法' = 'enforece'
}

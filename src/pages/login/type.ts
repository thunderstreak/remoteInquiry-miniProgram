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

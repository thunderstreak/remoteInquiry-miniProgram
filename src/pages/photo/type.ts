export interface responseText {
  cookies: string[];
  data: string;
  errMsg: string;
  header: Record<string, string>;
  statusCode: number;
}

export interface PhotoState {
  step: number;
  markUrl: string;
  nameUrl: string;
  timeUrl: string;
}

export interface NextParams {
  type: string;
  data?: string;
}

export interface SignProps {
  onNext?: (data: NextParams) => void;
  onPrev?: () => void;
  url?: string;
  step: number;
}

export interface SignState {}

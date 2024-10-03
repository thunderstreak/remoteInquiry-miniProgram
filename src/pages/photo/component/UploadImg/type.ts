export interface UploadItemFile {
  url: string;
  id: string;
}

export interface NextParams {
  type: string;
  data: UploadItemFile[];
}

export interface UploadImgProps {
  onNext?: (data: NextParams) => void;
}

export interface UploadImgState {}

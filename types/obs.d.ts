declare module 'esdk-obs-browserjs' {
  interface ObsClientParams {
    access_key_id: string
    secret_access_key: string
    server: string
  }

  abstract class ObsClient {
    new(options: ObsClientParams): any;

    createSignedUrlSync(options: CreateSignedUrlSyncParams): CreateSignedUrlSync;

    putObject(params: PutObjectParams): Promise<PutObjectData>;
  }

  interface CreateSignedUrlSyncParams {
    Method: string
    Bucket: string
    Key: string
    Expires: number
  }

  interface CreateSignedUrlSync {
    SignedUrl: string
  }

  interface PutObjectParams {
    Bucket: string
    Key: string
    SourceFile: File
    ProgressCallback: (transferredAmount: number, totalAmount: number, totalSeconds: number) => void
  }

  interface PutObjectData {
    CommonMsg: {
      Status: number
      Code: string
      HostId: string
      Id2: string
      InterfaceResult: null
      Message: string
      RequestId: string
    }
    InterfaceResult: {
      ContentLength: string
      Date: undefined
      ETag: string
      Id2: string
      RequestId: string
      Reserved: undefined
    }
  }

  export class obsClient extends ObsClient {
    constructor(params: ObsClientParams)

    createSignedUrlSync(options: CreateSignedUrlSyncParams): CreateSignedUrlSync

    putObject(params: PutObjectParams): Promise<PutObjectData>
  }

  export interface ObsUploadHandle {
    file: File
    obsKey?: string
    bucketName?: string
    callback?: (uploadSpeed: number, uploadPercent: number) => void
  }

  export default obsClient
}

interface ImportMetaEnv {
  readonly TARO_APP_ENV: 'dev' | 'test' | 'prod'
  readonly VITE_CDN_URL: string
  readonly VITE_CDN__MLMUrl_URL: string
  readonly VITE_CDN__BWL_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

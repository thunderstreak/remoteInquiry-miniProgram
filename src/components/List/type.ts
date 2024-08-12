import { ReactNode } from 'react'

interface Api {
  api: (...args: any[]) => Promise<any>
  params?: { [key: string]: any }
}

export interface ListForwardedRef {
  refresh: () => void
}

export interface ListProps<T> {
  options: Api // { api: {}, params: {} }
  children: ReactNode
  refresh?: boolean
  onReceived: (val: T) => void
  onEnd?: () => void // 接口请求结束
  msg?: string
  isEmpty?: boolean // 数据为空样式不显示传false
  className?: string
  disRefresh?: boolean // 是否禁止下拉刷新
  disPage?: boolean // 禁止分页请求
  immediate?: boolean // 是否立即执行
}

export interface ListState<T> {
  pageNum: number;
  hasMore: boolean;
  sysTime: number;
  list: T[];
}

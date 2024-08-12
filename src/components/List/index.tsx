import { ListForwardedRef, ListProps, ListState } from '@/components/List/type'
import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { ScrollView, View } from '@tarojs/components'
import { useReachBottom } from '@tarojs/taro'
import Empty from '@/components/Empty'

const initialState: <T>() => ListState<T> = () => ({
  pageNum: 1,
  hasMore: true,
  sysTime: 0,
  list: []
})

const List: <T>(
  props: ListProps<T>,
  ref: React.ForwardedRef<ListForwardedRef>
) => React.ReactNode = (props, ref) => {
  const {
    children,
    options,
    onReceived,
    onEnd,
    msg = '暂无数据',
    isEmpty = true,
    className,
    disRefresh = false,
    disPage = false,
    immediate = true
  } = props
  const stateRef = useRef(
    initialState<Parameters<typeof props.onReceived>[0]>()
  )
  const [fresh, setFresh] = useState(false)
  const [loading, setLoading] = useState(true)
  const [empty, setEmpty] = useState(true)

  const handleOnReceived = useCallback(() => {
    onReceived(stateRef.current.list as any)
  }, [onReceived])

  const handleGetActivityList = useCallback(
    () =>
      options
        .api({
          pageSize: 10,
          pageNum: stateRef.current.pageNum,
          ...options.params
        })
        .then((res) => {
          const { data, sysTime, totalPages } = res
          if (data) {
            let pageNum = stateRef.current.pageNum
            const hasMore = pageNum < totalPages
            // disPage表示不分页，一次请求完所有数据，所有list每次只拿接口请求到的数据
            const list = !disPage
              ? [...stateRef.current.list, ...data]
              : [...data]
            if (hasMore) {
              pageNum += 1
            }
            stateRef.current = {
              ...stateRef.current,
              list,
              hasMore,
              pageNum,
              sysTime: sysTime ?? 0
            }
            setEmpty(!list.length)
          } else {
            // 如果data为null或者为空
            setEmpty(true)
          }
        })
        .catch(() => {
          stateRef.current = { ...stateRef.current }
          setEmpty(true)
        })
        .finally(() => {
          setLoading(false)
          if (onEnd) {
            onEnd()
          }
          handleOnReceived()
        }),
    [disPage, handleOnReceived, onEnd, options]
  )
  // 触底加载下一页数据
  const handleScrollToLower = useCallback(() => {
    if (stateRef.current.hasMore && !disPage) {
      handleGetActivityList().then()
    }
  }, [disPage, handleGetActivityList])
  // 下拉刷新
  const handleRefresherPulling = useCallback(() => {
    stateRef.current = initialState()
    setFresh(true)
    handleGetActivityList().finally(() => {
      setFresh(false)
    })
  }, [handleGetActivityList])

  useEffect(() => {
    if (immediate) {
      handleGetActivityList().then(handleOnReceived)
    }
  }, [handleGetActivityList, handleOnReceived, immediate])

  useImperativeHandle(ref, () => ({
    refresh: () => {
      stateRef.current = initialState()
      handleGetActivityList().catch()
    }
  }))
  useReachBottom(() => {
    if (stateRef.current.hasMore && !disPage) {
      handleGetActivityList().then()
    }
  })

  return (
    <>
      {!empty ? (
        <ScrollView
          className={`${className}`}
          scrollY
          onScrollToLower={handleScrollToLower}
          refresherEnabled={!disRefresh}
          refresherTriggered={fresh}
          onRefresherRefresh={handleRefresherPulling}
          enhanced
          id="scroll"
        >
          {children}
        </ScrollView>
      ) : null}
      {!loading && empty && isEmpty ? (
        <View className="flex flex-col flex-1 h-full">
          <Empty
            url="https://obs.prod.ubanquan.cn/obs_717104887800001717743052_pre$prod-ubq"
            msg={msg}
          />
        </View>
      ) : null}
    </>
  )
}
export default memo(forwardRef(List))

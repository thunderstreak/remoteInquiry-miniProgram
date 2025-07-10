import React, { memo, useState } from 'react'
import { Video } from '@nutui/nutui-react-taro'
import { VideoProps } from './type'

const options = {
  autoplay: true,
  muted: false,
  controls: true
}

const Index: React.FC<VideoProps> = ({ src }) => {
  const [source, setSource] = useState({
    src: src,
    type: 'video/mp4'
  })

  const play = (elm: any) => console.log('play', elm)
  const pause = (elm: any) => console.log('pause', elm)
  const playend = (elm: any) => console.log('playend', elm)
  return (
    <Video
      source={source}
      options={options}
      onPlay={play}
      onPause={pause}
      onPlayEnd={playend}
      style={{ height: '280px' }}
    />
  )
}

export default memo(Index)

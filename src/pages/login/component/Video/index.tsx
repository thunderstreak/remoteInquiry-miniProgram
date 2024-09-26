import React, { memo, useState } from 'react'
import { Video } from '@nutui/nutui-react-taro'

const options = {
  autoplay: true,
  muted: false,
  controls: true
}

const Index: React.FC = () => {
  const [source, setSource] = useState({
    src: 'https://storage.360buyimg.com/nutui/video/video_NutUI.mp4',
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

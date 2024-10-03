import icon_signal_1 from '@/assets/images/signal/signal_1.svg'
import icon_signal_2 from '@/assets/images/signal/signal_2.svg'
import icon_signal_3 from '@/assets/images/signal/signal_3.svg'
import icon_signal_4 from '@/assets/images/signal/signal_4.svg'

const DEVICE_TYPE_MAP: Record<string, string> = {
  webrtc: 'noicon',
  soft: 'noicon',
  hard: 'nemo',
  nemono: 'nemo',
  virtualnemo: 'nemo',
  nemo: 'nemo',
  tvbox: 'tvbox',
  h323: 'h323',
  bruce: 'bruce',
  desk: 'noicon',
  tel: 'tel',
  shtl: 'shtl',
  default: 'noicon'
}

/**
 * 获取终端默认头像
 *
 * @param {string} type
 * @param {string} theme 'default' | 'blue'
 * @returns
 */
export const getDeviceAvatar = (type = 'default') => {
  const prefix = '../assets/images/device/'

  type = DEVICE_TYPE_MAP[type] || DEVICE_TYPE_MAP['default']

  return `${prefix}${type}.png`
}

export const getNetworkLevelImage = (networkLevel: number) => {
  return {
    1: icon_signal_1,
    2: icon_signal_2,
    3: icon_signal_3,
    4: icon_signal_4
  }[networkLevel]
}

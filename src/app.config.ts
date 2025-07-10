import {
  COLLECTOR_CARD_PAGE_URL,
  COLLECTOR_FINGERPRINT_PAGE_URL,
  CONFERENCE_PAGE_URL,
  HOME_PAGE_URL,
  LOGIN_PAGE_URL,
  PHOTO_PAGE_URL,
  SIGN_PAGE_URL,
  ENFORCEMENT_LIST_PAGE_URL,
  ENFORCEMENT_APPLY_PAGE_URL,
  ENFORCEMENT_RECORD_PAGE_URL,
} from '@/constants'

export default defineAppConfig({
  pages: [
    LOGIN_PAGE_URL,
    HOME_PAGE_URL,
    PHOTO_PAGE_URL,
    SIGN_PAGE_URL,
    CONFERENCE_PAGE_URL,
    COLLECTOR_CARD_PAGE_URL,
    COLLECTOR_FINGERPRINT_PAGE_URL,
    ENFORCEMENT_LIST_PAGE_URL,
    ENFORCEMENT_APPLY_PAGE_URL,
    ENFORCEMENT_RECORD_PAGE_URL,
  ],
  subPackages: [
    {
      root: 'package',
      name: 'package',
      pages: ['pages/userProtocol/index', 'pages/privacyPolicy/index']
    }
  ],
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于小程序位置接口的效果展示'
    }
    // 'scope.record': {
    //   desc: '使用麦克风进行通讯'
    // },
    // 'scope.camera': {
    //   desc: '使用摄像头进行面对面通讯'
    // }
  },
  // tabBar: {
  //   borderStyle: 'black',
  //   color: '#929292',
  //   selectedColor: '#000',
  //   list: [
  //     {
  //       pagePath: HOME_PAGE_URL,
  //       text: '活动',
  //       iconPath: 'assets/img/tabbar/home.png',
  //       selectedIconPath: 'assets/img/tabbar/home-active.png'
  //     },
  //     {
  //       pagePath: MY_PAGE_URL,
  //       text: '我的',
  //       iconPath: 'assets/img/tabbar/photo.png',
  //       selectedIconPath: 'assets/img/tabbar/photo-active.png'
  //     }
  //   ]
  // },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  lazyCodeLoading: 'requiredComponents',
  requiredPrivateInfos: [
    'chooseLocation'
  ]
})

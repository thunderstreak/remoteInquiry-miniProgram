import { HOME_PAGE_URL, LOGIN_PAGE_URL, MY_PAGE_URL } from '@/constants'

export default defineAppConfig({
  pages: [LOGIN_PAGE_URL, HOME_PAGE_URL, MY_PAGE_URL],
  // subPackages: [
  //   {
  //     root: 'package',
  //     name: 'package',
  //     pages: []
  //   }
  // ],
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
  //       iconPath: 'assets/img/tabbar/my.png',
  //       selectedIconPath: 'assets/img/tabbar/my-active.png'
  //     }
  //   ]
  // },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  lazyCodeLoading: 'requiredComponents'
})

import { HOME_PAGE_URL, LOGIN_PAGE_URL, MY_PAGE_URL } from '@/constants'

export default defineAppConfig({
  pages: [HOME_PAGE_URL, MY_PAGE_URL, LOGIN_PAGE_URL],
  subPackages: [
    {
      root: 'package',
      name: 'package',
      pages: []
    }
  ],
  tabBar: {
    borderStyle: 'black',
    color: '#929292',
    selectedColor: '#000',
    list: [
      {
        pagePath: HOME_PAGE_URL,
        text: '活动',
        iconPath: 'assets/img/tabbar/home.png',
        selectedIconPath: 'assets/img/tabbar/home-active.png'
      },
      {
        pagePath: MY_PAGE_URL,
        text: '我的',
        iconPath: 'assets/img/tabbar/my.png',
        selectedIconPath: 'assets/img/tabbar/my-active.png'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  lazyCodeLoading: 'requiredComponents'
})

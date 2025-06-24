import config, { PlatformTypes } from "@/config"

export default definePageConfig({
  navigationBarTitleText: '千名千探',
  navigationStyle: config.PLATFORM === PlatformTypes.交警云执法 ? 'default' : 'custom',
  navigationBarTextStyle: 'white',
  navigationBarBackgroundColor: '#1D2F3E',
  pageOrientation: config.PLATFORM === PlatformTypes.交警云执法 ? 'portrait' : 'landscape'
})

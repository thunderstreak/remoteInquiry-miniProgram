import config, { PlatformTypes } from "@/config"

export default definePageConfig({
  navigationBarTitleText: '千名千探',
  navigationStyle: 'custom',
  backgroundTextStyle: 'dark',
  pageOrientation: 'landscape'
  // pageOrientation: config.PLATFORM === PlatformTypes.交警云执法 ? 'portrait' : 'landscape'
})

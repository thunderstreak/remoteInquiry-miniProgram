import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss/webpack'
import devConfig from './dev'
import prodConfig from './prod' // https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig(async (merge, { command, mode }) => {
  console.log('command:', command, 'mode:', mode)
  const baseConfig: UserConfigExport = {
    projectName: 'ubq mini',
    date: '2024-5-24',
    designWidth(input: any) {
      // 配置 NutUI 375 尺寸
      if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
        return 375
      }
      // 全局使用 Taro 默认的 750 尺寸
      return 375
    },
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      390: 2,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    // 开启 HTML 插件
    plugins: ['@tarojs/plugin-html', '@tarojs/plugin-http'],
    defineConstants: {
      'process.env': JSON.stringify(process.env)
    },
    copy: {
      patterns: [],
      options: {}
    },
    framework: 'react',
    compiler: {
      type: 'webpack5',
      prebundle: {
        exclude: ['@nutui/nutui-react-taro', '@nutui/icons-react-taro']
      }
    },
    cache: {
      enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
      optimizeMainPackage: {
        enable: true
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true // 忽略css文件引入顺序
      },
      postcss: {
        htmltransform: {
          enable: true,
          // 设置成 false 表示 不去除 * 相关的选择器区块
          // 假如开启这个配置，它会把 tailwindcss 整个 css var 的区域块直接去除掉
          config: {
            removeCursorStyle: false
          }
        },
        pxtransform: {
          enable: true,
          config: {}
        },
        url: {
          enable: true,
          config: {
            limit: 1024 // 设定转换尺寸上限
          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
        chain.merge({
          plugin: {
            install: {
              plugin: UnifiedWebpackPluginV5,
              args: [{ appType: 'taro' }]
            }
          }
        })
      }
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',
      output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js'
      },
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      router: {
        mode: 'browser' // 或者是 'browser'
      },
      webpackChain(chain) {
        chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)
      }
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  }
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})

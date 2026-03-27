import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import dayjs from 'dayjs'
import pkg from './package.json'
import { createSvg } from './src/components/svgIcon/svg'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const { dependencies, devDependencies, name, version } = pkg
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
}

export default ({ mode }) => {
  return defineConfig({
    base: '/',
    server: {
      host: '0.0.0.0',
      port: 9527,
      fs: {
        strict: false
      }
      // proxy: {
      //   '/api': {
      //     target: 'http://sph-api.atguigu.cn', // 接口的域名
      //     secure: false, // 如果是https接口，需要配置这个参数
      //     changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
      //     rewrite: (path) => path.replace(/^\/api/, '')
      //   }
      // }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus', '@element-plus/icons-vue'],
            echarts: ['echarts'],
            editor: ['@wangeditor/editor-for-vue', 'wangeditor', 'md-editor-v3'],
            utils: ['axios', 'dayjs', 'nprogress', 'qs']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        'dayjs',
        'element-plus',
        'axios',
        'nprogress',
        'qs',
        '@element-plus/icons-vue'
      ],
      // 强制预构建，避免首次加载慢
      force: false,
      // 排除不需要预构建的大文件
      exclude: []
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      __APP_NAME__: JSON.stringify('taopinhui_vue3')
    },

    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag === 'iconify-icon'
          }
        }
      }),
      vueJsx(),
      VueSetupExtend(),
      AutoImport({
        resolvers: [
          ElementPlusResolver(),
          // Auto import icon components
          // 自动导入图标组件
          IconsResolver()
        ]
      }),
      Components({
        resolvers: [
          // Auto register icon components
          // // 自动注册图标组件
          IconsResolver({
            enabledCollections: ['ep']
          }),
          ElementPlusResolver({
            // 开发环境禁用 sass，使用编译好的 CSS，速度快 10 倍以上
            importStyle: mode === 'development' ? false : 'sass'
          })
        ],
        exclude: [/^IEp[A-Z]/] // 添加这行来排除所有 IEp 开头的图标组件
      }),

      Icons({
        autoInstall: true
      }),

      // 移除开发环境全局样式导入，使用按需导入避免预构建阻塞

      createSvg('./src/components/svgIcon/svgIcons/'),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      })
    ],

    resolve: {
      alias: {
        '~/': `${path.resolve(__dirname, 'src')}/`,
        assets: `${path.resolve(__dirname, 'src/assets')}/`,
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 开发环境不注入变量，减少编译时间
          additionalData: mode === 'development' ? '' : `@use "~/assets/css/variables.scss" as *;`,
          sassOptions: {
            outputStyle: 'expanded',
            charset: false
          }
        }
      },
      // 开发环境禁用 CSS 代码分割，减少请求数
      devSourcemap: false
    }
  })
}

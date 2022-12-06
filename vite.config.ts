// import { createVuePlugin } from 'vite-plugin-vue2'
import vue from '@vitejs/plugin-vue2'
import { createHtmlPlugin } from 'vite-plugin-html'
import { UserConfig, ConfigEnv, loadEnv } from 'vite'
import viteSvgIcons from 'vite-plugin-svg-icons'
// import commonjs from 'vite-plugin-commonjs'
const { viteCommonjs } = require('@originjs/vite-plugin-commonjs')
import path from 'path'
const getViteEnv = (mode: string, target: string) => {
    return loadEnv(mode, process.cwd())[target]
}
const version = () => {
    const date = new Date()
    return (
        date.getFullYear() +
        '-' +
        (date.getMonth() + 1) +
        '-' +
        date.getDate() +
        '-' +
        date.getMilliseconds()
    )
}
const getConfig = (mode: string): Object => {
    let data = { version: '' }
    data.version = version()
    return data
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
    return {
        plugins: [
            vue(),
            createHtmlPlugin({
                // minify: false,
                inject: {
                    // Inject data into ejs template
                    data: {
                        data: mode == 'production' && getConfig(mode),
                        baseUrl: getViteEnv(mode, 'VUE_APP_URL'),
                        title: '药房端',
                    },
                },
            }),
            viteSvgIcons({
                // 指定需要缓存的图标文件夹
                iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
                // 指定symbolId格式
                symbolId: 'icon-[dir]-[name]',
            }),
            viteCommonjs({
                // lodash不需要进行转换
                exclude: ['lodash'],
            }),
        ],
        base: './',
        resolve: {
            extensions: ['.vue', '.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
            alias: [
                {
                    find: '@',
                    replacement: '/src',
                },
            ],
        },
        define: { 'process.env': {} },
        build: {
            // 设置vite打包大小控制
            chunkSizeWarningLimit: 10000,
        },
    }
}

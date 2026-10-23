import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ProblemIndex from './components/ProblemIndex.vue'
import ABCIndex from './components/ABCIndex.vue'
import ARCIndex from './components/ARCIndex.vue'
import AGCIndex from './components/AGCIndex.vue'
import './custom.css'
export default {
    extends: DefaultTheme,

    enhanceApp({ app }) {
        app.component('ProblemIndex', ProblemIndex)
        app.component('ABCIndex', ABCIndex)
        app.component('ARCIndex', ARCIndex)
        app.component('AGCIndex', AGCIndex)
    },
} satisfies Theme

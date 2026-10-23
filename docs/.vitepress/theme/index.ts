import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ProblemIndex from './components/ProblemIndex.vue'
import ABCIndex from './components/AtCoderIndex.vue'

export default {
    extends: DefaultTheme,

    enhanceApp({ app }) {
        app.component('ProblemIndex', ProblemIndex)
        app.component('AtCoderIndex', ABCIndex)
    },
} satisfies Theme

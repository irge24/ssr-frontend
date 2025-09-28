// eslint.config.js
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
    ...pluginVue.configs['flat/recommended'],

    {
        rules: {
        'no-unused-vars': 'warn',
        'vue/multi-word-component-names': 'off',
        },
        languageOptions: {
        sourceType: 'module',
        globals: {
            ...globals.browser,
            test: 'readonly',
            expect: 'readonly',
            describe: 'readonly',
            beforeEach: 'readonly',
            afterEach: 'readonly',
            vi: 'readonly'
        }
        }
    }
]

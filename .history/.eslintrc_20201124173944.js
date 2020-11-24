const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {
    curly: ['error', 'multi-line'],
    'no-unused-vars': isProd ? ['error'] : ['warn'],
    'vue/no-v-html': 0,
    'arrow-parens': ['error', 'as-needed'],
    'vue/component-name-in-template-casing': ['error', 'PascalCase', { registeredComponentsOnly: false }],
    'template-curly-spacing': 0,
    indent: ['error', 2, {
      ignoredNodes: ['TemplateLiteral']
    }],
    'vue/custom-event-name-casing': 0,
    'vue/no-lone-template': 0
  }
}

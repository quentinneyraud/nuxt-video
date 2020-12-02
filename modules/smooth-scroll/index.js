const path = require('path')

// const DEFAULT_OPTIONS = {}

module.exports = function (moduleOptions) {
  // Merge options
  // const options = {
  //   ...DEFAULT_OPTIONS,
  //   ...this.options.smoothScroll,
  //   ...moduleOptions
  // }

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    ssr: false
  })

  this.addPlugin({
    src: path.resolve(__dirname, 'components.js'),
    ssr: true
  })

  this.addTemplate({
    src: path.resolve(__dirname, 'components/SmoothScrollContainer.vue'),
    fileName: 'components/SmoothScrollContainer.vue'
  })

  this.addTemplate({
    src: path.resolve(__dirname, 'components/SmoothScrollFixed.vue'),
    fileName: 'components/SmoothScrollFixed.vue'
  })
}

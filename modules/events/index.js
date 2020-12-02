import path from 'path'

export default function () {
  const options = this.options.events || []

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options,
    ssr: true
  })
}

import Vue from 'vue'

const lerp = (value, target, coeff) => {
  return value * (1 - coeff) + target * coeff
}

let cont = null

class SmoothScrool {
  constructor () {
    this.data = new Vue({
      data () {
        return {
          target: 0,
          current: 0,
          ratio: 1,
          smooth: false
        }
      },
      computed: {
        scrollTop () {
          return this.current
        },
        scrollDelta () {
          if (!this.smooth) return 0

          return this.target - this.current
        }
      },
      watch: {
        smooth (isSmooth) {
          if (isSmooth) {
            cont.parentNode.style.position = 'fixed'
            cont.parentNode.style.top = '0px'
            cont.parentNode.style.left = '0px'
            cont.parentNode.style.width = '100%'
            cont.parentNode.style.height = '100%'
          }
        }
      }
    })

    this.bindMethods()
  }

  setRatio (ratio) {
    this.data.ratio = ratio

    return this
  }

  setContainer (container) {
    this.container = container
    cont = this.container

    return this
  }

  setActive (active) {
    this.data.smooth = active

    return this
  }

  bindMethods () {
    this.onScroll = this.onScroll.bind(this)
  }

  start () {
    this.initEvents()
  }

  initEvents () {
    window.addEventListener('scroll', this.onScroll)

    return this
  }

  goTo (scrollValue) {
    window.scrollTo(0, 0)
    this.data.target = scrollValue
    this.data.current = scrollValue
  }

  scrollTo (yValue) {
    window.scrollTo(0, yValue)
  }

  scrollOfOneViewport () {
    if (!this.data.smooth) {
      this.scrollTo(window.innerHeight)
    } else {
      this.scrollTo(Math.min(this.height - window.innerHeight, window.innerHeight + 1))
    }
  }

  scrollToTop () {
    this.goTo(0)
  }

  onTick () {
    this.data.current = this.data.smooth ? lerp(this.data.current, this.data.target, this.data.ratio) : window.scrollY
  }

  onResize () {
    this.setBoundings()
  }

  onScroll () {
    this.data.target = window.scrollY
    if (!this.data.smooth) this.data.current = this.data.target
  }

  setBoundings () {
    if (!this.data.smooth) return

    document.body.style.height = `${this.container.clientHeight}px`
  }

  destroy () {
    window.removeEventListener('scroll', this.onScroll)
  }
}

const smoothScroll = new SmoothScrool()

export default (_, inject) => {
  inject('smoothScroll', smoothScroll)
}

// Vue.directive('scroll-fixed', {
//   inserted (el, _, { context }) {
//     context.$events.$on('ticker', _ => {
//       el.style.transform = `translate3d(0px, ${context.$smoothScroll.data.current.toFixed(2) * -1}px, 0px)`
//     })
//   }
// })

// Vue.directive('scroll-ratio', {
//   inserted (el, { value }, { context }) {
//     context.$events.$on('ticker', _ => {
//       let style = {}

//       if (value.custom && typeof (value.custom) === 'function') {
//         const { top } = el.getBoundingClientRect()
//         const ratio = (-top / window.innerHeight) / 2 + 0.5

//         value.custom(ratio)
//       }

//       if (Object.prototype.hasOwnProperty.call(value, 'x') || Object.prototype.hasOwnProperty.call(value, 'y')) {
//         const x = Object.prototype.hasOwnProperty.call(value, 'x') ? value.x : 0
//         const y = Object.prototype.hasOwnProperty.call(value, 'y') ? value.y : 0

//         style = {
//           ...style,
//           transform: `translate3d(${(context.$smoothScroll.data.current * x).toFixed(2)}px, ${(context.$smoothScroll.data.current * y).toFixed(2)}px, 0px)`
//         }
//       }

//       setStyle(el, style)
//     })
//   }
// })

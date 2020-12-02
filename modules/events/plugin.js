import Vue from 'vue'

const dd = (callback, wait) => {
  let timeout

  return () => {
    window.clearTimeout(timeout)
    timeout = setTimeout(() => callback(), wait)
  }
}

const getGsap = _ => {
  try {
    return require('gsap').default
  } catch (e) {
    return false
  }
}

const gsapInstalled = (_ => {
  try {
    return !!require.resolve('gsap')
  } catch (e) {
    return false
  }
})()

const Events = new Vue({
  data () {
    return {
      internalStartTime: null,
      internalLastTime: null,
      rafId: null,
      isListeningTicker: false,
      isListeningResize: false,
      events: []
    }
  },
  computed: {
    tickerEvents () {
      return this.events.filter(event => event.type === 'ticker')
    },
    hasTickerEvent () {
      return this.tickerEvents.length > 0
    },
    resizeEvents () {
      return this.events.filter(event => event.type === 'resize')
    },
    hasResizeEvent () {
      return this.resizeEvents.length > 0
    }
  },
  watch: {
    hasTickerEvent (newValue) {
      if (newValue && !this.isListeningTicker) {
        this.startTicker()
        this.isListeningTicker = true
      }
      if (!newValue && this.isListeningTicker) {
        this.stopTicker()
        this.isListeningTicker = false
      }
    },
    hasResizeEvent (newValue) {
      if (newValue && !this.isListeningResize) {
        this.listenResize()
        this.isListeningResize = true
      }
      if (!newValue && this.isListeningResize) {
        this.stopResize()
        this.isListeningResize = false
      }
    }
  },
  methods: {
    addTickerEvent (options = {}) {
      this.events.push({
        type: 'ticker',
        callback: this.emit,
        options
      })
    },
    addResizeEvent (options = {}) {
      this.events.push({
        type: 'resize',
        callback: options.debounce ? dd(this.emit.bind(this, { type: 'resize', options }), options.debounce) : this.emit,
        options
      })
    },
    emit (event, data = {}) {
      const eventName = event?.options?.name || event.type

      this.$emit(eventName, {
        ...data,
        eventOptions: {
          type: event.type,
          ...event?.options
        }
      })
    },
    /**
     * Resize
     */
    onResize () {
      this.resizeEvents.forEach(resizeEvent => {
        resizeEvent.callback(resizeEvent)
      })
    },
    listenResize () {
      window.addEventListener('resize', this.onResize)
    },
    stopResize () {
      window.removeEventListener('resize', this.onResize)
    },
    /**
     * Ticker
     */
    _internalTick () {
      const currentTime = new Date().getTime()

      this.onTick(currentTime - this.internalStartTime, currentTime - this.internalLastTime, null, null)

      this.internalLastTime = currentTime

      this.rafId = window.requestAnimationFrame(this._internalTick)
    },
    onTick (time, deltaTime, frame, elapsed) {
      this.tickerEvents.forEach(tickerEvent => {
        tickerEvent.callback(tickerEvent, {
          time,
          deltaTime,
          frame,
          elapsed
        })
      })
    },
    startTicker () {
      if (gsapInstalled) {
        const gsap = getGsap()
        gsap.ticker.add(this.onTick)
      } else {
        this.internalStartTime = new Date().getTime()
        this.internalLastTime = this.internalStartTime
        this._internalTick()
      }
    },
    stopTicker () {
      if (gsapInstalled) {
        const gsap = getGsap()
        gsap.ticker.remove(this.onTick)
      } else if (this.rafId) {
        window.cancelAnimationFrame(this.rafId)
        this.rafId = null
      }
    }
  }
})

const options = JSON.parse('<%= JSON.stringify(options) %>')

options.forEach(event => {
  if ((typeof event === 'string' && event === 'ticker') || (typeof event === 'object' && event.type === 'ticker')) {
    Events.addTickerEvent()
  }

  if ((typeof event === 'string' && event === 'resize') || (typeof event === 'object' && event.type === 'resize')) {
    Events.addResizeEvent(event.options)
  }
})

export default (_, inject) => {
  inject('events', Events)
}

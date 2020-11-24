<script>
// Constants
const CLASSNAME = 'in-view'

export default {
  props: {
    active: {
      type: Boolean,
      required: false,
      default: true
    },
    threshold: {
      type: Number,
      required: false,
      default: 0
    },
    offset: {
      type: Number,
      required: false,
      default: 0
    },
    delay: {
      type: Number,
      required: false,
      default: 0
    },
    once: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      isVisible: false
    }
  },
  watch: {
    isVisible (isVisible) {
      if (isVisible) {
        this.onEnter()
      } else {
        this.onLeave()
      }
    },
    active (isActive) {
      if (isActive) {
        this.createObserver()
      }
    }
  },
  beforeUpdate () {
    if (this.isVisible) {
      this.$nextTick(() => {
        this.$slots.default[0].elm.classList.add(CLASSNAME)
      })
    }
  },
  mounted () {
    if (!this.active) return

    if (this.observer.isObserving) {
      this.createObserver()
    } else {
      this.$bus.$on('observer:observe', this.createObserver)
    }
  },
  methods: {
    createObserver () {
      const defaultOptions = {
        root: null,
        rootMargin: `0px 0px ${-this.offset}px 0px`,
        threshold: this.threshold
      }
      const observer = new IntersectionObserver(
        this.handleIntersect,
        defaultOptions
      )
      this.$nextTick(() => {
        observer.observe(this.$el)
      })
    },
    handleIntersect (entries, observer) {
      let entry = entries[0]

      // Fix bug multiple entries
      if (entries.length > 1) {
        const intersectingEntry = entries.find(e => e.isIntersecting)
        if (intersectingEntry) {
          entry = intersectingEntry
        }
      }

      const isIntersecting = entry.isIntersecting && entry.intersectionRatio >= this.threshold

      if (isIntersecting) {
        window.setTimeout(_ => {
          this.isVisible = true
        }, this.delay)

        if (this.once) observer.unobserve(entry.target)
      } else {
        this.isVisible = false
      }
    },
    onEnter () {
      this.$emit('enter', {
        el: this.$el
      })
      this.$el.classList.add(CLASSNAME)
    },
    onLeave () {
      this.$emit('leave', {
        el: this.$el
      })
      this.$el.classList.remove(CLASSNAME)
    }
  },
  render () {
    return this.$slots.default
  }
}
</script>

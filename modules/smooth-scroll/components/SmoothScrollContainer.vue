<script>
export default {
  props: {
    active: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      ratio: 0.1
    }
  },
  mounted () {
    this.setRatio()

    this.$smoothScroll
      .setContainer(this.$el)
      .setRatio(this.ratio)
      .setActive(true)
      .start()

    this.$smoothScroll.setBoundings()

    this.$events.$on('ticker', this.onTick)
  },
  methods: {
    setRatio () {
      this.ratio = 0.1
    },
    onTick () {
      this.$el.style.transform = `translate3d(0px, ${(this.$smoothScroll ? this.$smoothScroll.data.current * -1 : 0).toFixed(2)}px, 0px)`
      this.$smoothScroll.onTick()
    }
  },
  render () {
    return this.$slots.default
  }
}
</script>

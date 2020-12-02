<script>
export default {
  props: {
    active: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  mounted () {
    this.$events.$on('ticker', this.onTick)
  },
  methods: {
    onTick () {
      this.$el.style.transform = `translate3d(0px, ${(this.$smoothScroll ? this.$smoothScroll.data.current * 1 : 0).toFixed(2)}px, 0px)`
    }
  },
  render () {
    return this.$slots.default
  }
}
</script>

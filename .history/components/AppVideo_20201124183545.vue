<template>
  <ViewportObserver
    v-bind="viewportObserverOptions"
    :active="lazyload"
    @enter="onEnterViewport"
  >
    <div
      class="AppVideo-component"
      allow="fullscreen"
      allowfullscreen
    >
      <div
        class="AppVideo-ratioHelper"
        :style="{
          paddingTop: ratio
        }"
      >
        <div class="AppVideo-main">
          <!-- Default video -->
          <video
            v-if="provider === 'local'"
            ref="player"
            class="AppVideo-player"
            v-bind="{
              muted,
              controls: defaultControls,
              preload: lazyload ? 'none' : 'metadata'
            }"
          >
            <source :src="src">
          </video>
        </div>
      </div>
    </div>
  </ViewportObserver>
</template>

<script>
export default {
  props: {
    provider: {
      type: String,
      required: true,
      validator: v => ['local', 'vimeo', 'youtube'].includes(v)
    },
    id: {
      type: Number,
      required: false,
      default: null
    },
    src: {
      type: [String, Array],
      required: false,
      default: null
    },
    useRatio: {
      type: Boolean,
      required: false,
      default: true
    },
    muted: {
      type: Boolean,
      required: false,
      default: false
    },
    defaultControls: {
      type: Boolean,
      required: false,
      default: true
    },
    lazyload: {
      type: Boolean,
      required: false,
      default: true
    },
    viewportObserverOptions: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      state: {
        isPlaying: false,
        isPaused: false,
        isLoading: false,
        isLoaded: false,
        isFullScreen: false,
        isError: false
      },
      ratio: '56.25%'
    }
  },
  mounted () {
    if (!this.lazyload) {
      this.load()
    }
  },
  methods: {
    initalize () {
      this.$refs.player.addEventListener('canplaythrough', this.onCanPlayThrough)
    },
    /**
     *
     * Flow
     *
     */
    load () {
      this.state.isLoading = true

      // this.$refs.player.preload = 'auto'
    },
    onEnterViewport () {
      this.load()
    },
    onCanPlayThrough () {
      this.state.isLoading = false
      this.state.isLoaded = true
    },
    /**
     *
     * Actions
     *
     */
    play () {
      this.player
        .play()
        .catch(_ => {
        })
    },
    pause () {
      this.player
        .pause()
        .catch(_ => {
        })
    },
    stop () {
      this.player.pause()
      this.player.setCurrentTime(0)
    },
    onPlayClick () {
      this.play()
    },
    onPauseClick () {
      this.pause()
    },
    onPlay () {
      this.isPlaying = true
      this.isPaused = false
      this.$bus.$on('tick', this.onTick)
      this.$emit('play')
    },
    onPause () {
      this.$bus.$off('tick', this.onTick)
      this.isPlaying = false
      this.isPaused = true
    },
    setFullScreen () {
      const method = this.$el.requestFullscreen || this.$el.mozRequestFullScreen || this.$el.webkitRequestFullscreen || this.$el.msRequestFullscreen
      method?.()
    },
    exitFullScreen () {
      const method = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen
      method?.()
    }
  }
}
</script>

<style lang="stylus" scoped>
.AppVideo-component
  position relative
  height 100%
  width 100%

.AppVideo-ratioHelper
  position relative
  width 100%

.AppVideo-main
  position absolute
  top 0
  left 0
  bottom 0
  right 0
  width 100%
  height 100%

.AppVideo-player
  position relative
  width 100%
  height 100%
</style>

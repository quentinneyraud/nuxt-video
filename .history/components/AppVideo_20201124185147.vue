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
          <!-- Interface -->
          <div class="AppVideo-interface" />

          <!-- Interface -->
          <div class="AppVideo-poster">
            <slot name="poster">
              <img :src="thumbnail" alt="">
            </slot>
          </div>

          <div class="AppVideo-video">
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
    thumbnail: {
      type: String,
      required: false,
      default: null
    },
    defaultRatio: {
      type: Number,
      required: false,
      default: 16/9
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
      ratio: defaultRatio
    }
  },
  mounted () {
    if (!this.lazyload) {
      this.load()
    }
  },
  computed: {
    ratioPaddingTop () {
      return this.
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

.AppVideo-main, .AppVideo-interface, .AppVideo-poster, .AppVideo-video
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
  outline none

.AppVideo-video
  z-index 10

.AppVideo-interface
  z-index 20

.AppVideo-poster
  background-color #000
  z-index 30

  img
    width 100%
    height 100%
    object-fit cover
</style>

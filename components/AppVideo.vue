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
          '--aspect-ratio': aspectRatio
        }"
      >
        <!-- Interface -->
        <div v-if="!hasDefaultControls" class="AppVideo-interface" />

        <!-- Interface -->
        <div v-if="!state.isPlaying" class="AppVideo-poster">
          <slot name="poster">
            <img :src="thumbnail" alt="">

            <button @click="onPlayClick">
              play
            </button>
          </slot>
        </div>

        <div class="AppVideo-video">
          <!-- Default video -->
          <video
            v-if="isLocal"
            ref="player"
            class="AppVideo-player"
            v-bind="{
              muted,
              controls: hasDefaultControls,
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
// Providers
const VIMEO_PROVIDER = 'vimeo'
const YOUTUBE_PROVIDER = 'youtube'
const LOCAL_PROVIDER = 'local'

export default {
  props: {
    provider: {
      type: String,
      required: true,
      validator: provider => [LOCAL_PROVIDER, VIMEO_PROVIDER, YOUTUBE_PROVIDER].includes(provider)
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
    hasDefaultControls: {
      type: Boolean,
      required: false,
      default: true
    },
    customControls: {
      type: Array,
      required: false,
      default: null
    },
    thumbnail: {
      type: String,
      required: false,
      default: null
    },
    defaultAspectRatio: {
      type: Number,
      required: false,
      default: 16 / 9
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
      aspectRatio: this.defaultAspectRatio
    }
  },
  computed: {
    isVimeo () {
      return this.provider === VIMEO_PROVIDER
    },
    isYoutube () {
      return this.provider === YOUTUBE_PROVIDER
    },
    isLocal () {
      return this.provider === LOCAL_PROVIDER
    }
  },
  watch: {
    aspectRatio (newAspectRatio, oldAspectRatio) {
      this.$emit('aspect-ratio-change', {
        oldAspectRatio,
        newAspectRatio
      })
    }
  },
  mounted () {
    this.initalize()

    if (!this.lazyload) {
      this.load()
    }
  },
  methods: {
    initalize () {
      if (this.isLocal) {
        this.$refs.player.addEventListener('canplaythrough', this.onCanPlayThrough)
        this.$refs.player.addEventListener('play', this.onPlay)
      }
    },
    /**
     *
     * Flow
     *
     */
    load () {
      this.state.isLoading = true

      return new Promise((resolve, reject) => {
        if (this.state.isLoaded) resolve()

        const onCanPlayThrough = _ => {
          resolve()
          this.$refs.player.removeEventListener('canplaythrough', onCanPlayThrough)
        }
        this.$refs.player.addEventListener('canplaythrough', onCanPlayThrough)

        this.$refs.player.preload = 'auto'
      })
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
    async onPlayClick () {
      if (this.state.isLoaded) {
        this.play()
      } else {
        await this.load()
      }
    },
    play () {
      if (this.isLocal) {
        this.$refs.player.play()
      }
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
    onPauseClick () {
      this.pause()
    },
    onPlay () {
      this.state.isPlaying = true
      this.state.isPaused = false
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

  &:before
    content ''
    display block
    padding-bottom calc((100% / var(--aspect-ratio)))

  & > :first-child
    position absolute
    top 0
    left 0
    height 100%

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
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    object-fit cover

  button
    position absolute
    z-index 10
    color white
</style>
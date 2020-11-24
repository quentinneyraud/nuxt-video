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
      <div class="AppVideo-ratioHelper">
        <div class="AppVideo-main">
          <!-- Default video -->
          <video
            v-if="provider === 'local'"
            ref="player"
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

      this.$refs.player.preload = 'auto'
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
.VimeoPlayer-component
  position relative
  height 0
  width 100%
  background-color black
  height 100%
  no-select()
  min-height 100px

  &.has-basic-player
    .VimeoPlayer-video
      interaction()

.VimeoPlayer-main
  overflow hidden

  &.has-ratio
    position absolute
    top 0
    left 0
    bottom 0
    right 0
    width 100%
    height 100%

.VimeoPlayer-video
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  no-interaction()

  /deep/ iframe
    width 100%
    height 100%

.VimeoPlayer-thumbnail
  position absolute
  top 0
  left 0
  width 100%
  height 100%

.thumbnail-enter-active
  transition opacity 0.8s easeInCubic

.thumbnail-leave-active
  transition opacity 0.8s easeOutCubic

.thumbnail-enter, .thumbnail-leave-to
  opacity 0

.VimeoPlayer-controls
  position absolute
  bottom 0
  left 0
  width 100%
  no-interaction()
  display flex
  align-items center
  padding 10px 15px

.controls-enter-active
  transition all 0.8s easeInOutCubic

.controls-leave-active
  transition all 0.3s easeInOutCubic

.controls-enter, .controls-leave-to
  transform translateY(100%)

.VimeoPlayer-controlsState
  pointer()
  overflow hidden
  height 30px
  width 30px

  div
    flex-parent-center()
    height 30px
    width 30px
    transition transform 0.3s easeInOutCubic

    &:nth-child(1) svg
      height 20px
      width 10px

    &:nth-child(2) svg
      height 15px
      width 10px

  svg
    fill white

.VimeoPlayer-controlsFullscreen
  pointer()
  height 30px
  width 30px

  svg
    fill white
    width 15px
    height 15px

.VimeoPlayer-controlsProgress
  padding 15px 0
  position relative
  flex-grow 1
  interaction()
  margin-left 10px
  margin-right 10px

.VimeoPlayer-controlsProgressThumb
  position absolute
  width 100%
  top 50%
  transform translateY(-50%)
  background-color #fff
  width 100%
  height 1px
  no-interaction()

.VimeoPlayer-controlsProgressTrack
  position absolute
  top 50%
  transform translateY(-50%)
  width 10px
  height 10px
  border-radius 50%
  background-color #fff
  margin-left -5px
  no-interaction()

.VimeoPlayer-playButton
  centered()
  transition transform 0.3s easeInCubic

  &:hover
    transition transform 0.3s easeOutCubic
    transform translate(-50%, -50%) scale(1.2)

  svg
    fill white
    height 45px
    width 30px

.play-enter-active
  transition opacity 0.5s linear, transform 0.5s easeOutCubic

.play-leave-active
  transition opacity 0.5s linear, transform 0.5s easeOutCubic

.play-enter, .play-leave-to
  transform translate(-50%, 20px)
  opacity 0

.VimeoPlayer-loader
  position absolute
  top 40px
  left 50%
  width 40px
  height 40px
  border 1px solid white
  animation test 2s linear infinite
  transform translate(-50%, 0px)

.loader-enter-active
  transition all 0.8s easeInOutCubic

.loader-leave-active
  transition all 0.3s easeInOutCubic

.loader-enter, .loader-leave-to
  transform translate(-50%, -40px)

@keyframes test
  0%
    transform rotate(0deg)

  100%
    transform rotate(360deg)
</style>

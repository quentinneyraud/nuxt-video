<template>
  <div
    v-observe-visibility="lazyload === 'observer' ? {
      callback: isVisible => isVisible && initialize(),
      once: true
    }: null"
    :style="{
      paddingTop: ratio
    }"
    class="VimeoPlayer-component"
    :class="{
      'is-loaded': isLoaded,
      'is-loading': isLoading,
      'has-basic-player': hasBasicPlayer
    }"
    allow="fullscreen"
    allowfullscreen
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @fullscreenchange="onFullscreenChange"
  >
    <div
      class="VimeoPlayer-main"
      :class="{
        'has-ratio': autoHeight
      }"
    >
      <!-- Player -->
      <div
        ref="player"
        class="VimeoPlayer-video"
      />

      <!-- Controls -->
      <transition name="controls">
        <div v-show="((isPlaying && hover) || isPaused) && !forceThumbnailDisplayed && !hasBasicPlayer" ref="controls" class="VimeoPlayer-controls">
          <!-- State -->
          <button
            v-cursor="{
              state: 'grow'
            }"
            class="VimeoPlayer-controlsState"
            @click="isPlaying ? onPauseClick() : onPlayClick()"
          >
            <div
              :style="{
                transform: `translateY(${ isPlaying ? -100 : 0 }%)`
              }"
            >
              <play />
            </div>
            <div
              :style="{
                transform: `translateY(${ isPlaying ? -100 : 0 }%)`
              }"
            >
              <pause />
            </div>
          </button>

          <!-- Progress -->
          <div
            ref="progress"
            class="VimeoPlayer-controlsProgress"
            @mouseenter="onProgressMouseEnter"
            @mouseleave="onProgressMouseLeave"
            @mousemove="throttledOnProgressMouseMove"
            @click="onProgressClick"
          >
            <div ref="thumb" class="VimeoPlayer-controlsProgressThumb" />
            <div ref="track" class="VimeoPlayer-controlsProgressTrack" />
          </div>

          <!-- Fullscreen -->
          <button
            v-cursor="{
              state: 'grow',
              text: 'Fullscreen'
            }"
            class="VimeoPlayer-controlsFullscreen"
            @click="goFullScreen"
          >
            <fullscreen />
          </button>
        </div>
      </transition>

      <!-- Thumbnail -->
      <transition name="thumbnail">
        <app-image
          v-if="hasThumbnail"
          v-show="(!isPlaying && !isPaused) || forceThumbnailDisplayed"
          ref="thumbnail"
          class="VimeoPlayer-thumbnail"
          :lazyload="false"
          :url="thumbnail.url"
          :alt="thumbnail.alt"
          :sizes="[320, 768, 1620]"
        />
      </transition>

      <!-- Play -->
      <transition name="play">
        <button
          v-show="!isPlaying && !isPaused && isLoaded"
          v-cursor="{
            state: 'grow',
            text: 'Play'
          }"
          class="VimeoPlayer-playButton"
          aria-label="Play"
          @click="onPlayClick"
        >
          <play />
        </button>
      </transition>
    </div>
  </div>
</template>

<script>
// Libraries
import { gsap } from 'gsap'

let VimeoPlayer
if (process.browser) {
  VimeoPlayer = require('@vimeo/player').default
}

const nofs = (_) => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}

const fs = (el) => {
  if (el.requestFullscreen) {
    el.requestFullscreen()
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen()
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen()
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen()
  }
}

const throttle = function (cb, delay) {
  let canCall = true

  return function () {
    if (!canCall) { return }
    cb.apply(this, arguments)
    canCall = false

    setTimeout(() => {
      canCall = true
    }, delay)
  }
}

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
    url: {
      type: String,
      required: false,
      default: null
    },
    thumbnail: {
      type: Object,
      required: false,
      default: null
    },
    autoHeight: {
      type: Boolean,
      required: false,
      default: false
    },
    lazyload: {
      type: [String, Boolean],
      required: false,
      default: 'observer'
    }
  },
  data () {
    return {
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      isLoaded: false,
      isFullScreen: false,
      duration: 0,
      hover: false,
      forceThumbnailDisplayed: false,
      ratio: '56.25%'
    }
  },
  computed: {
    hasThumbnail () {
      return !!this.thumbnail?.url
    },
    useLazyload () {
      return this.lazyload === 'observer' || this.lazyload === 'called'
    },
    hasBasicPlayer () {
      if (!process.browser) { return false }

      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    }
  },
  mounted () {
    if (!this.useLazyload) {
      this.initialize()
    }
  },
  beforeDestroy () {
    this.$bus.$off('tick', this.onTick)
  },
  methods: {
    async initialize () {
      if (this.isLoaded) { return }

      this.isLoading = true
      this.player = new VimeoPlayer(this.$refs.player, {
        id: this.id,
        loop: false,
        controls: this.hasBasicPlayer,
        byline: false,
        portrait: false,
        title: false
      })
      this.player.on('play', this.onPlay)
      this.player.on('pause', this.onPause)
      this.player.on('loaded', this.onLoaded)

      this.duration = await this.player.getDuration()
    },
    async setRatio () {
      const [width, height] = await Promise.all([this.player.getVideoWidth(), this.player.getVideoHeight()])

      this.ratio = (height / width) * 100 + '%'
      this.$smoothScroll.setBoundings()
    },
    onFullscreenChange () {
      this.isFullScreen = window.fullscreen || document.fullscreen
    },
    onMouseEnter () {
      this.hover = true
    },
    onMouseLeave () {
      this.hover = false
    },
    play () {
      this.player
        .play()
        .catch((_) => {
        })
    },
    pause () {
      this.player
        .pause()
        .catch((_) => {
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
    goFullScreen () {
      if (this.isFullScreen) {
        nofs()
      } else {
        fs(this.$el)
      }
    },
    onLoaded () {
      this.isLoading = false
      this.isLoaded = true
      this.$emit('loaded')

      if (this.autoHeight) {
        this.setRatio()
      }
    },
    onProgressMouseLeave (e) {
      this.$bus.$emit('cursor:grow', {
        active: false
      })
    },
    onProgressMouseEnter (e) {
      const clickRatio = e.offsetX / this.$refs.progress.clientWidth
      const time = this.duration * clickRatio

      const minutes = Math.floor(time / 60).toFixed().padStart(2, '0')
      const seconds = (time % 60).toFixed().padStart(2, '0')

      const formattedTime = `${minutes}:${seconds}`

      this.$bus.$emit('cursor:grow', {
        active: true,
        text: `Go to ${formattedTime}`
      })
    },
    throttledOnProgressMouseMove: throttle(function (e) {
      const clickRatio = e.offsetX / this.$refs.progress.clientWidth
      const time = this.duration * clickRatio

      const minutes = Math.floor(time / 60).toFixed().padStart(2, '0')
      const seconds = (time % 60).toFixed().padStart(2, '0')

      const formattedTime = `${minutes}:${seconds}`

      this.$bus.$emit('cursor:grow', {
        active: true,
        text: `Go to ${formattedTime}`
      })
    }, 500),
    onProgressClick (e) {
      const clickRatio = e.offsetX / this.$refs.progress.clientWidth
      const time = this.duration * clickRatio

      this.player.setCurrentTime(time)
        .then(this.play)
        .catch((_) => {})
    },
    async onTick () {
      const currentTime = await this.player.getCurrentTime()

      gsap
        .to(this.$refs.track, {
          duration: 0.1,
          x: this.$refs.thumb.clientWidth * currentTime / this.duration
        })
    },
    showThumbnail () {
      this.forceThumbnailDisplayed = true
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

  +tablet-up()
    padding 30px

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

  +tablet-up()
    margin-left 30px
    margin-right 30px

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

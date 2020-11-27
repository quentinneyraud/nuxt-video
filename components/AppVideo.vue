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
        <div v-if="!hasDefaultControls" class="AppVideo-interface">
          <!-- Controls -->
          <div class="AppVideo-controls">
            <div class="AppVideo-controlsInner">
              <slot name="controls">
                <template
                  v-for="(customControl, customControlIndex) in customControls"
                >
                  <!-- Play -->
                  <div
                    v-if="customControl === 'play'"
                    :key="customControlIndex"
                    class="AppVideo-control AppVideo-actions"
                  >
                    <slot
                      name="actions"
                      v-bind="{}"
                    >
                      <div class="AppVideo-actionsButtons">
                        <button
                          v-if="state.isPaused || !state.isPlaying"
                          class="AppVideo-actionButton AppVideo-playButton"
                          aria-label="Play the video"
                          @click="play"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75.2 94.9">
                            <path d="M71.8 41.1L12 1.3C6.9-2.1 0 1.6 0 7.7v79.5c0 6.2 6.9 9.8 12 6.4l59.8-39.8c4.5-2.9 4.5-9.7 0-12.7z" />
                          </svg>
                        </button>

                        <button
                          v-if="state.isPlaying"
                          class="AppVideo-actionButton AppVideo-pauseButton"
                          aria-label="Pause the video"
                          @click="pause"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 81.1 95.1">
                            <path d="M26.2 0H3.9C1.8 0 0 1.7 0 3.9v87.3c0 2.1 1.7 3.9 3.9 3.9h22.2c2.1 0 3.9-1.7 3.9-3.9V3.9C30 1.7 28.3 0 26.2 0zM77.3 0H55c-2.1 0-3.9 1.7-3.9 3.9v87.3c0 2.1 1.7 3.9 3.9 3.9h22.2c2.1 0 3.9-1.7 3.9-3.9V3.9c0-2.2-1.7-3.9-3.8-3.9z" />
                          </svg>
                        </button>
                      </div>
                    </slot>
                  </div>

                  <!-- Time -->
                  <div
                    v-if="customControl === 'time'"
                    :key="customControlIndex"
                    class="AppVideo-control AppVideo-time"
                  >
                    <slot
                      name="time"
                      v-bind="{
                        currentTime,
                        formattedCurrentTime: formatTime(currentTime),
                        duration,
                        formattedDuration: formatTime(duration)
                      }"
                    >
                      <span class="AppVideo-currentTime">
                        {{ formatTime(currentTime) }}
                      </span>
                      <span class="AppVideo-timeSeparator">/</span>
                      <span class="AppVideo-duration">
                        {{ formatTime(duration) }}
                      </span>
                    </slot>
                  </div>

                  <!-- Progress -->
                  <div
                    v-if="customControl === 'progress'"
                    :key="customControlIndex"
                    class="AppVideo-control AppVideo-progress"
                  >
                    <slot
                      name="progress"
                      v-bind="{
                        currentTime,
                        duration,
                        timeRatio
                      }"
                    >
                      <div class="AppVideo-progressTrack" />
                      <div
                        class="AppVideo-progressThumb"
                        :style="{
                          '--time-ratio': timeRatio
                        }"
                      />
                    </slot>
                  </div>

                  <!-- Mute -->
                  <div
                    v-if="customControl === 'mute'"
                    :key="customControlIndex"
                    class="AppVideo-control AppVideo-mute"
                  >
                    <slot
                      name="mute"
                      v-bind="{}"
                    >
                      <button
                        class="AppVideo-muteButton"
                        :class="{
                          '--is-muted': state.isMuted
                        }"
                        :aria-label="state.isMuted ? 'Unmute the video' : 'Mute the video'"
                        @click="state.isMuted ? unmute() : mute()"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M10.6.1L5 5v10l5.6 4.9c.7.3 1.4-.2 1.4-.9V1c0-.7-.7-1.2-1.4-.9zM0 6v8c0 .6.4 1 1 1h2V5H1c-.6 0-1 .4-1 1zM14 6.6v6.8c1.2-.7 2-2 2-3.4s-.8-2.7-2-3.4z" />
                          <path d="M14 2.3v2.1c2.3.8 4 3 4 5.6s-1.7 4.8-4 5.6v2.1c3.4-.9 6-4 6-7.7s-2.5-6.8-6-7.7z" />
                        </svg>
                      </button>
                    </slot>
                  </div>

                  <!-- Fullscreen -->
                  <div
                    v-if="customControl === 'fullscreen'"
                    :key="customControlIndex"
                    class="AppVideo-control AppVideo-fullscreen"
                  >
                    <slot
                      name="fullscreen"
                      v-bind="{}"
                    >
                      <button
                        class="AppVideo-fullscreenButton"
                        :class="{
                          '--is-fullscreen': state.isFullScreen
                        }"
                        :aria-label="state.isFullscreen ? 'Exit fullscreen' : 'Go fullscreen'"
                        @click="state.isFullScreen ? exitFullscreen() : goFullscreen()"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path d="M9 3v2H5v4H3V3h6zM3 15h2v4h4v2H3v-6zM15 3h6v6h-2V5h-4V3zm4 12h2v6h-6v-2h4v-4z" />
                        </svg>
                      </button>
                    </slot>
                  </div>
                </template>
              </slot>
            </div>
          </div>
        </div>

        <!-- Poster -->
        <div v-if="showPoster && !state.isPlaying" class="AppVideo-poster">
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

// Controls
const AVAILABLE_CONTROLS = ['play', 'time', 'progress', 'mute', 'fullscreen']

const getYoutubePackage = _ => {
  try {
    return require('youtube-player').default
  } catch (e) {
    return null
  }
}

const getVimeoPackage = _ => {
  try {
    return require('@vimeo/player').default
  } catch (e) {
    return null
  }
}

export default {
  props: {
    /**
     *
     * Provider infos
     *
     */
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
    youtubeOptions: {
      type: Object,
      required: false,
      default: null
    },
    vimeoOptions: {
      type: Object,
      required: false,
      default: null
    },
    src: {
      type: [String, Array],
      required: false,
      default: null
    },
    /**
     *
     * Templating
     *
     */
    useRatio: {
      type: Boolean,
      required: false,
      default: true
    },
    defaultAspectRatio: {
      type: Number,
      required: false,
      default: 16 / 9
    },
    showPoster: {
      type: Boolean,
      required: false,
      default: true
    },
    thumbnail: {
      type: String,
      required: false,
      default: null
    },
    /**
     *
     * Player options
     *
     */
    muted: {
      type: Boolean,
      required: false,
      default: false
    },
    customControls: {
      type: Array,
      required: false,
      default: _ => AVAILABLE_CONTROLS,
      validator: controls => {
        return !controls
          .some(control => {
            if (!AVAILABLE_CONTROLS.includes(control)) {
              // eslint-disable-next-line no-console
              console.warn(`${control} is not a valid control. Use one of these: ${AVAILABLE_CONTROLS.join(', ')}`)
              return true
            }

            return false
          })
      }
    },
    hasDefaultControls: {
      type: Boolean,
      required: false,
      default () {
        if (Array.isArray(this.customControls)) return false

        return true
      }
    },
    /**
     *
     * Lazyload
     *
     */
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
        isError: false,
        isMuted: this.muted
      },
      aspectRatio: this.defaultAspectRatio,
      currentTime: 0,
      duration: 0,
      timeRatio: 0
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
        this.$refs.player.addEventListener('pause', this.onPause)
        this.$refs.player.addEventListener('timeupdate', this.onTimeUpdate)
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
      if (this.isLocal) {
        this.duration = this.$refs.player.duration
      }
    },
    onTimeUpdate () {
      if (this.isLocal) {
        this.currentTime = this.$refs.player.currentTime
        this.timeRatio = this.currentTime / this.duration
      }
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
      if (this.isLocal) {
        this.$refs.player.pause()
      }
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
      this.state.isPlaying = false
      this.state.isPaused = true
    },
    goFullscreen () {
      const method = this.$el.requestFullscreen || this.$el.mozRequestFullScreen || this.$el.webkitRequestFullscreen || this.$el.msRequestFullscreen
      method?.call(this.$el)

      this.state.isFullScreen = true
    },
    exitFullscreen () {
      const method = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen
      method?.call(document)

      this.state.isFullScreen = false
    },
    mute () {
      this.state.isMuted = true

      if (this.isLocal) {
        this.$refs.player.muted = true
      }
    },
    unmute () {
      this.state.isMuted = false
      this.$refs.player.muted = false
    },
    /**
     *
     * Utils
     *
     */
    formatTime (time) {
      const hours = Math.floor(time / 60 * 60).toFixed().padStart(2, '0')
      const minutes = Math.floor(time / 60).toFixed().padStart(2, '0')
      const seconds = (time % 60).toFixed().padStart(2, '0')

      return time > 3600 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`
    }

  }
}
</script>

<style lang="stylus" scoped>
.AppVideo-component
  position relative
  height 100%
  width 100%

  button
    background-color transparent
    outline none
    border none
    cursor pointer

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

/**

  Controls

 */
.AppVideo-controls
  position absolute
  bottom 0
  left 0
  width 100%
  height 100px
  padding 0 35px

  &:after
    content ''
    position absolute
    top -100%
    left 0
    bottom 0
    right 0
    width 100%
    height 200%
    background linear-gradient(to top, black, transparent)

.AppVideo-control
  margin 0 10px

  &:first-child
    margin-left 0

  &:last-child
    margin-right 0

.AppVideo-controlsInner
  position relative
  width 100%
  height 100%
  z-index 10
  display flex
  align-items center

/**

  Time

 */
.AppVideo-time
  position relative
  z-index 10

.AppVideo-currentTime, .AppVideo-duration
  color white

.AppVideo-duration
  font-weight bold

.AppVideo-timeSeparator
  color white

/**

  Play

 */
.AppVideo-actionsButtons
  position relative
  width 40px
  height 40px

.AppVideo-actionButton
  position absolute
  top 0
  left 0
  width 40px
  height 40px

  svg
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    max-width 30px
    max-height 30px
    fill white
    pointer-events none

.AppVideo-progress
  position relative
  flex-grow 1

.AppVideo-progressTrack
  position absolute
  top 50%
  left 0
  width 100%
  height 1px
  transform translateY(-50%)
  background-color grey

.AppVideo-progressThumb
  position absolute
  top 50%
  left 0
  width 100%
  height 2px
  background-color white
  transform-origin left center
  transform translateY(-50%) scaleX(var(--time-ratio))
  transition transform 0.2s

/**

  Mute

 */
.AppVideo-mute
  position relative
  width 40px
  height 40px

.AppVideo-muteButton
  position absolute
  top 0
  left 0
  width 40px
  height 40px

  &:after
    content ''
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%) rotate(-50deg) scaleX(0)
    transition transform 0.3s ease-in-out
    height 4px
    width 80%
    border-radius 5px
    background-color white
    pointer-events none

  &.--is-muted:after
    transform translate(-50%, -50%) rotate(-50deg) scaleX(1)

  svg
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    max-width 30px
    max-height 30px
    fill white
    pointer-events none

/**

  Fullscreen

 */
.AppVideo-fullscreen
  position relative
  width 40px
  height 40px

.AppVideo-fullscreenButton
  position absolute
  top 0
  left 0
  width 40px
  height 40px

  svg
    position absolute
    top 50%
    left 50%
    transform translate3d(-50%, -50%, 0px)
    max-width 30px
    max-height 30px
    fill white
    pointer-events none
</style>

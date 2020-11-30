<template>
  <div class="container">
    <AppVideo
      provider="local"
      :src="localSrc"
      :muted="true"
      :show-poster="false"
      :lazyload="true"
      :has-default-controls="false"
    />
    <AppVideo
      :id="vimeoId"
      provider="vimeo"
      :muted="true"
      :show-poster="false"
      :lazyload="false"
      :has-default-controls="false"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      vimeoId: '28236362',
      youtubeId: '',
      localSrc: require('assets/video.mp4'),
      thumbnail: require('assets/thumbnail.jpg')
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  width calc(100% - 100px)
  margin 0 auto
  margin-top 50px
</style>

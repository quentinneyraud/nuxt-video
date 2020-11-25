<template>
  <div class="container">
    <AppVideo
      provider="local"
      :src="localSrc"
      :muted="true"
      :thumbnail="thumbnail"
      :has-default-controls="false"
      :custom-controls="['time', 'progress']"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      vimeoId: '',
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
  m0 align-content
</style>

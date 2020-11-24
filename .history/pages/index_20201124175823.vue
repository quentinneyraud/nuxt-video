<template>
  <div class="container">
    <AppVideo provider="local" :src="localSrc" :muted="true" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      vimeoId: '',
      youtubeId: '',
      localSrc: require('assets/video.mp4')
    }
  }
}
</script>

<style>
</style>

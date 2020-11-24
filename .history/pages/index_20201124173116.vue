<template>
  <div class="container">
    <AppVideo />
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

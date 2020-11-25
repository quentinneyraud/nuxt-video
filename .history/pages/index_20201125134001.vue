<template>
  <div class="container">
    <AppVideo
      provider="local"
      :src="localSrc"
      :muted="true"
      :thumbnail="thumbnail"
      :custom-controls="['time', 'ok']"
    >
      <!-- <template #poster>
        ok
      </template> -->
    </AppVideo>
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

<style>
</style>

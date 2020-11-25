<template>
  <div class="container">
    <AppVideo
      provider="local"
      :src="localSrc"
      :muted="true"
      :thumbnail="thumbnail"
      :has-default-controls="false"
      :custom-controls="['time', 'progress']"
    >
      <template #time="{ formattedCurrentTime }">
        {{ formattedCurrentTime + 'okkkk' }}
      </template>
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

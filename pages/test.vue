<template>
  <div class="container">
    <div class="ok" />
    <SmoothScrollFixed>
      <div class="ok2" />
    </SmoothScrollFixed>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
.ok
  height 500vh
  width 80%
  margin 0 auto
  background-color red
  margin-top 350px

.ok2
  position absolute
  top 450px
  left 0
  height 100px
  width 80%
  background-color blue
</style>

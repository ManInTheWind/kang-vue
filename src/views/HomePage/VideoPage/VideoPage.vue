<template>
  <div :key="item" v-for="item in 20">
    <VideoItem></VideoItem>
  </div>
</template>

<script setup lang='ts'>
import VideoItem from './VideoItem.vue';
</script>

<style lang="less" scoped></style>

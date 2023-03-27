<template>
  <el-row :gutter="20" justify="center" style="height: 3vh;">
    <el-col :span="6">
      <el-tabs v-model="currentIndex" stretch @tab-change="handleSwitch">
        <el-tab-pane :label="item.name" :name="index"  :key="index" v-for="(item, index) in Tabs">
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>

  <keep-alive>
    <component v-bind:is="comId"></component>
  </keep-alive>
</template>

<script setup lang="ts">
import { type Component, shallowRef, markRaw, ref, reactive, getCurrentInstance, } from 'vue';
import type { TabPaneName } from 'element-plus'
import PhotosPage from '../PhotosPage/PhotosPage.vue';
import VideoPage from '../VideoPage/VideoPage.vue';
import SearchPage from '../SearchPage/SearchPage.vue';

const instance = getCurrentInstance();
const comId = shallowRef<Component>(PhotosPage);
const currentIndex = ref(0);

let beforeIndex = currentIndex.value;
instance?.proxy?.$Bus.on('*', (type) => {
  if (type === 'begin-search') {
    beforeIndex = currentIndex.value;
    currentIndex.value = 2;
    comId.value = Tabs[currentIndex.value].component;
  } else if (type === 'cancel-search') {
    currentIndex.value  = beforeIndex;
    comId.value = Tabs[currentIndex.value].component;
  }
})


interface TabsItem {
  name: string,
  component: Component,
}
const Tabs = reactive<TabsItem[]>([
  {
    name: '图片',
    component: markRaw(PhotosPage),
  },
  {
    name: '视频',
    component: markRaw(VideoPage),
  },
  {
    name: '搜索',
    component: markRaw(SearchPage),
  }
]);

const handleSwitch = (name: TabPaneName) => {
  currentIndex.value = name as number;
  comId.value = Tabs[currentIndex.value].component;
}
</script>
<style lang="less" scoped>
.active-tab {
  background-color: hsla(160, 100%, 37%, 1);
  border-radius: 10px 0px 0px 10px;

}

.unactive-tab {
  background-color: var(--color-border);
  border-radius: 0px 10px 10px 0px;
}

.tabs {
  // padding: 5px 10px;
  // height: 30px;
  margin: 5px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: large;
  font-weight: bold;
}
</style>

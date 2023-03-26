<template>
  <el-row :gutter="20" justify="center" style="height: 3vh;">
    <el-col :span="6">
      <el-tabs stretch class="demo-tabs" @tab-change="handleSwitch">
        <el-tab-pane :label="item.name" :key="index" v-for="(item, index) in Tabs">
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>

  <keep-alive>
    <component v-bind:is="comId"></component>
  </keep-alive>
</template>

<script setup lang="ts">
import { ref, reactive, type Component, shallowRef, markRaw } from 'vue';
import type { TabPaneName } from 'element-plus'
import PhotosPage from '../PhotosPage/PhotosPage.vue';
import VideoPage from '../VideoPage/VideoPage.vue';


const comId = shallowRef<Component>(PhotosPage);
const active = ref(0);

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
]);
// function onSwitchTab(item: TabsItem, index: number) {
//   comId.value = item.component
//   active.value = index;
// }
const handleSwitch = (name: TabPaneName) => {
  comId.value = Tabs[name as number].component;

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

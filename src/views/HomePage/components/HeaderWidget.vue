<template>
  <el-row class="header-box" justify="center" align="middle">
    <el-col :span="10">
      <el-input ref="SearchInput" class="input-with-select" clearable v-model="query" placeholder="搜索更多"
        @focus="onFocus" @keydown.enter="onBlur">
        <template #prepend>
          <el-select v-model="currentType" :placeholder="OptionList[currentType]" style="width: 115px">
            <el-option :key="index" v-for="(item, index) in  OptionList" :label="item" :value="index" />
            <!-- <el-option label="视频" value="2" /> -->
          </el-select>
        </template>
        <template #append>
          <el-button :icon="Search" />
        </template>
      </el-input>
    </el-col>
  </el-row>
</template>

<script setup lang='ts'>
import { Search } from '@element-plus/icons-vue'
import { ref, getCurrentInstance, } from 'vue';
const query = ref<String>();
const instance = getCurrentInstance();
const currentType = ref(0);
const OptionList: string[] = ['图片', '视频'];

const onFocus = () => {
  instance?.proxy?.$Bus.emit('begin-search')
}
let lastSearch: String;
let lastType: number;
const onBlur = () => {
  // console.log('query.value',query.value);
  if (query.value && query.value.length > 0 && (query.value !== lastSearch || currentType.value != lastType)) {
    lastSearch = query.value;
    lastType = currentType.value;
    instance?.proxy?.$Bus.emit('on-search', {
      query: query.value,
      type: currentType.value,
    });
    (instance?.refs.SearchInput as HTMLInputElement).blur();

  } else {
    instance?.proxy?.$Bus.emit('cancel-search')
  }
}



</script>


<style lang="less" scoped>
.header-box {
  height: 8vh;
}
</style>

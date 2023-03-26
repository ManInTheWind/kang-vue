<template>
  <el-row class="header-box" justify="center" align="middle">
    <el-col :span="10">
      <el-input placeholder="搜索更多" class="input-with-select">
        <template #prepend>
          <el-select  placeholder="类型" style="width: 115px">
            <el-option label="图片" value="1" />
            <el-option label="视频" value="2" />
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
</script>

<style lang="less" scoped>
.header-box {
  height: 8vh;
}
</style>

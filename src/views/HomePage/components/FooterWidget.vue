<template>
  <el-row class="footer-box" justify="center" align="middle">
    <el-col :span="6">
      <el-pagination :current-page="currentPage" background layout="prev, pager, next" :total="totalPage" @current-change="onCurrentChange" />
    </el-col>
  </el-row>
</template>

<script setup lang='ts'>
import type { Ref} from 'vue'
defineProps<{
  currentPage?: number,
  totalPage: number,
}>();

const emit = defineEmits<{
  (e: 'current-change', value: number): void,
}>()

function onCurrentChange(value: number): void {
  emit('current-change', value);
}
</script>

<style lang="less" scoped>
.footer-box {
  height: 4vh;
}
</style>

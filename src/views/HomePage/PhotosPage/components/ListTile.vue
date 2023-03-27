<template>
    <el-row align="middle">
        <el-col :span="2">{{ title }}</el-col>
        <el-col :span="21" class="download-item">{{ content }}</el-col>
        <el-col :span="1">
            <el-row v-if="props.needAction" align="middle" >
                <el-progress v-if="$progress && !done"  type="circle" :percentage="$progress" :width="22" :stroke-width=2
                    :show-text=false color="#DB7093" style="padding-left: 12px;" />
                <el-button v-else @click="onDownload" type="primary" size="small" round text style="margin-left: 5px;">
                    下载
                </el-button>
            </el-row>
        </el-col>
    </el-row>
</template>
<script setup lang="ts">

import { ref } from 'vue';

const $progress = ref<number | undefined>();
const done = ref(false)

const props = withDefaults(defineProps<{
    title: string,
    content: string | number,
    needAction?: boolean,
}>(), {
    needAction: () => true,
}
);
type ProgressCallback = (progress: number | undefined) => void;
const emit = defineEmits<{
    (e: 'on-download', url: string, onProgress?: ProgressCallback,): void,
}>()
function onDownload() {
    done.value = false;
    $progress.value = undefined;
    emit('on-download', props.content as string, onProgress);
}

function onProgress(progress: number | undefined): void {
    console.log('progress:', progress);
    $progress.value = progress;
    if ($progress.value === 100) {
        done.value = true;
    }
}
</script>
<style lang="less" scoped>
.download-item {
    display: flex;
    align-items: center;
    background-color: var(--vt-c-black-mute);
    border-radius: 5px;
    // padding: 4px 8px;
    padding: 5px 10px;
    margin: 5px 0px;
}
</style>
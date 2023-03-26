<template>
    <el-row align="middle">
        <el-col :span="2">{{ title }}</el-col>
        <el-col :span="21" class="download-item">{{ content }}</el-col>
        <el-col :span="1">
            <el-button v-if="props.needAction" @click="onDownload" type="primary" size="small" round text
                style="margin-left: 5px;">下载</el-button>
        </el-col>
    </el-row>
</template>
<script setup lang="ts">

const props = withDefaults(defineProps<{
    title: string,
    content: string | number,
    needAction?: boolean,
}>(), {
    needAction: () => true,
}
);
type ProgressCallback = (progress: number) => void;
const emit = defineEmits<{
    (e: 'on-download', url: string): void,
}>()
function onDownload() {
    console.log('props.content:', props.content);
    emit('on-download', props.content as string);
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
<template>
    <MediaListItem>
        <template v-slot:image>
            <el-image style="width: 200px; height: 200px" :src="photoItem.src.small" fit="contain" />
        </template>
        <template v-slot:content>
            <ListTile title="width:" :content="photoItem.width" :need-action="false"></ListTile>
            <ListTile title="height:" :content="photoItem.height" :need-action="false"></ListTile>
            <ListTile title="url:" :content="photoItem.url" @on-download="onDownload"></ListTile>
            <ListTile title="original:" :content="photoItem.src.original" @on-download="onDownload"></ListTile>
            <ListTile title="large2x:" :content="photoItem.src.large2x" @on-download="onDownload"></ListTile>
            <ListTile title="large:" :content="photoItem.src.large" @on-download="onDownload"></ListTile>
            <ListTile title="medium:" :content="photoItem.src.medium" @on-download="onDownload"></ListTile>
            <ListTile title="small:" :content="photoItem.src.small" @on-download="onDownload"></ListTile>
            <ListTile title="portrait:" :content="photoItem.src.portrait" @on-download="onDownload"></ListTile>
            <ListTile title="landscape:" :content="photoItem.src.landscape" @on-download="onDownload"></ListTile>
            <ListTile title="tiny:" :content="photoItem.src.tiny" @on-download="onDownload"></ListTile>
        </template>
    </MediaListItem>
</template>
<script setup lang="ts">
import MediaListItem from '../../components/MediaListItem.vue';
import type { Photo } from 'pexels';

import { ElNotification, ElMessage } from 'element-plus';
import ListTile from '../../components/ListTile.vue';


defineProps<{
    photoItem: Photo,
}>()
type ProgressCallback = (progress: number | undefined) => void;

const onDownload = async (url: string, onProgress?: ProgressCallback) => {
    console.log(url);
    const notification = ElMessage({
        showClose: true,
        message: '正在下载，请稍等',
        type: 'success',
        duration: 0,
    });
    try {
        const response = await fetch(url)
        const reader = response.body?.getReader()
        let contentLength = response.headers.get('content-length') ?? 0;
        if (typeof (contentLength) === 'string') {
            contentLength = parseInt(contentLength);
        }
        let receivedLength = 0
        // eslint-disable-next-line no-undef
        const chunks: BlobPart[] = []
        let blob: Blob;
        let urlObject: string = '';
        const fileType = response.headers.get('content-type')?.split('/')[1]

        // eslint-disable-next-line no-inner-declarations
        async function read(onProgress: ProgressCallback | undefined, thisContext: any) {
            // eslint-disable-next-line no-unsafe-optional-chaining, @typescript-eslint/no-unused-vars
            const res = await reader?.read();
            if (res) {
                if (res.done) {
                    console.log('下载完成')
                    blob = new Blob(chunks, { type: `image/${fileType}` })
                    urlObject = window.URL.createObjectURL(blob)
                    // const blob = await response.blob();
                    const matchFilname: RegExpMatchArray | null = url.match(/\/([^/]+\.[^/?]+)(?:\?|$)/);
                    let filename: string;
                    if (matchFilname && matchFilname.length > 0) {
                        filename = matchFilname[1];
                    } else {
                        filename = `${Date.now()}.jpeg`;
                    }
                    // const urlObject = window.URL.createObjectURL(blob);
                    const linkElement = document.createElement('a');
                    linkElement.style.display = 'none';
                    linkElement.download = filename;
                    linkElement.href = urlObject;
                    linkElement.click();
                    notification.close();
                    return
                }
            }
            chunks.push(res!.value)
            receivedLength += res!.value.length
            const progress = Math.floor((receivedLength / (contentLength as number)) * 100)
            onProgress?.apply(thisContext, [progress]);
            read(onProgress, thisContext);
        }
        await read(onProgress, this)
    } catch (error) {
        notification.close();
        ElMessage({
            showClose: true,
            message: `下载失败:${error}`,
            type: 'error',
        });
    }
}
</script>
<style lang="less" scoped>
.box-card {
    background-color: var(--vt-c-black-soft);
    margin: 15px 15px 0px 15px;
    padding: 10px;
    border-radius: 15px;
}
</style>
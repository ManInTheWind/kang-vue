<template>
    <MediaGridItem>
        <template v-slot:image>
            <el-image :src="photoItem.src.small" fit="contain" style="height: 100%;" 
            :hide-on-click-modal="true"
            :initial-index="0"
            :preview-src-list="[photoItem.src.small,photoItem.src.medium,photoItem.src.large,photoItem.src.large2x,photoItem.src.original,photoItem.src.portrait,photoItem.src.landscape]"
            />
        </template>
        <template v-slot:description>
            <el-text size="small" v-if="photoItem.alt" truncated> {{ photoItem.alt }}</el-text>
        </template>
        <template #bottom-leading>
            <el-row>
                <el-tag class="mx-1" round>
                    w:{{ photoItem.width }}
                </el-tag>
                <el-tag class="mx-1" round>
                    h:{{ photoItem.height }}
                </el-tag>
            </el-row>
        </template>
        <template #bottom-trailing>
            <el-row justify="end" align="middle">
                <el-col :span="currentDownloadLink ? 18 : 12">
                    <el-select v-model="currentDownloadLink" filterable allow-create default-first-option
                        :reserve-keyword="false" placeholder="下载">
                        <el-option v-for="item in photoItem.src" :key="item" :label="item" :value="item" />
                    </el-select>

                </el-col>
                <el-col :span="6" v-if="currentDownloadLink">
                    <el-row align="middle">
                        <el-progress v-if="$progress && !done" type="circle" :percentage="$progress" :width="22"
                            :stroke-width=2 :show-text=false color="#DB7093" style="padding-left: 10px;" />
                        <el-button v-else @click="onDownload" type="primary" size="small" round
                            style="margin-left: 10px;">下载</el-button>
                    </el-row>
                </el-col>
            </el-row>
        </template>
    </MediaGridItem>
</template>
<script setup lang="ts">
import type { Photo } from 'pexels';
import MediaGridItem from '../../components/MediaGridItem.vue';

import { ElNotification, ElMessage } from 'element-plus';
import { ref } from 'vue';
defineProps<{
    photoItem: Photo,
}>()
const $progress = ref<number | undefined>();
const done = ref(false)
const currentDownloadLink = ref<string | undefined>();

const onDownload = async () => {
    const url = currentDownloadLink.value;
    if (!url) {
        ElMessage({
            showClose: true,
            message: '未选择链接',
            type: 'warning',
            duration: 0,
        });
        return;
    }
    console.log(url);
    const notification = ElMessage({
        showClose: true,
        message: '正在下载，请稍等',
        type: 'success',
        duration: 0,
    });
    try {
        const response = await fetch(url)

        // 创建 Response 的 Body 部分的可读流对象
        const reader = response.body?.getReader()

        // 获取文件总长度
        let contentLength = response.headers.get('content-length') ?? 0;
        if (typeof (contentLength) === 'string') {
            contentLength = parseInt(contentLength);
        }
        let receivedLength = 0

        // 创建 Blob 对象和 URL 对象
        // eslint-disable-next-line no-undef
        const chunks: BlobPart[] = []
        let blob: Blob;
        let urlObject: string = '';
        const fileType = response.headers.get('content-type')?.split('/')[1]
        const matchFilname: RegExpMatchArray | null = url.match(/\/([^/]+\.[^/?]+)(?:\?|$)/);
        let filename: string;
        if (matchFilname && matchFilname.length > 0) {
            filename = matchFilname[1];
        } else {
            filename = `${Date.now()}.jpeg`;
        }

        // 开始递归读取流数据
        // eslint-disable-next-line no-inner-declarations
        async function read() {
            // eslint-disable-next-line no-unsafe-optional-chaining, @typescript-eslint/no-unused-vars
            const res = await reader?.read();
            if (res && res.done) {
                console.log('下载完成')
                done.value = true;
                currentDownloadLink.value = undefined;
                blob = new Blob(chunks, { type: `image/${fileType}` })
                urlObject = window.URL.createObjectURL(blob)
                const linkElement = document.createElement('a');
                linkElement.style.display = 'none';
                linkElement.download = filename;
                linkElement.href = urlObject;
                linkElement.click();
                notification.close();

                return
            }
            chunks.push(res!.value)
            receivedLength += res!.value.length

            // 计算并输出下载进度
            const progress = Math.floor((receivedLength / (contentLength as number)) * 100)
            $progress.value = progress;

            // 继续读取下一段数据
            read()
        }
        await read()

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
<style lang="less" scoped></style>
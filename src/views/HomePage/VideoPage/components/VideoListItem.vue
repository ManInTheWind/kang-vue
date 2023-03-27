<template>
  <MediaListItem>
      <template v-slot:image>
          <el-image style="width: 200px; height: 200px" :src="videoItem.video_pictures[0].picture" fit="contain" />
      </template>
      <template v-slot:content>
          <ListTile title="width:" :content="videoItem.width" :need-action="false"></ListTile>
          <ListTile title="height:" :content="videoItem.height" :need-action="false"></ListTile>
          <ListTile title="duration:" :content="videoItem.duration" :need-action="false"></ListTile>
          <div :key="index" v-for="(item,index) in videoItem.video_files">
              <ListTile title="link:" :content="item.link" @on-download="onDownload"></ListTile>
          </div>
      </template>
  </MediaListItem>
</template>
<script setup lang="ts">
import MediaListItem from '../../components/MediaListItem.vue';
import type { Video } from 'pexels';
import ListTile from '../../components/ListTile.vue';

import {  ElMessage } from 'element-plus';

defineProps<{
  videoItem: Video,
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

</style>
<template>
    <div class="content-box" v-loading="loading">
        <el-radio-group v-model="currentStyle" @change="handleSwitchStyle" class="style-box">
            <el-radio-button :key="item" v-for="item in styleList" :label="item">
            </el-radio-button>
        </el-radio-group>
        <div v-if="currentMediaType == MediaType.Photos" :class="[currentStyle == '网格' ? 'grid-container' : '']">
            <div :key="item.id" v-for="item in photoResult[currentPageNo]">
                <PhotoGridItem v-if="currentStyle == '网格'" :photo-item="item"></PhotoGridItem>
                <PhotosListItem v-else :photo-item="item"></PhotosListItem>
            </div>
        </div>
        <div v-else :class="[currentStyle == '网格' ? 'grid-container' : '']">
            <div :key="item.id" v-for="item in videoResult[currentPageNo]">
                <VideoGridItem v-if="currentStyle == '网格'" :video-item="item"></VideoGridItem>
                <VideoListItem v-else :video-item="item"></VideoListItem>
            </div>
        </div>
    </div>
    <FooterWidget :current-page="currentPageNo" :total-page="totalPage" @current-change="onCurrentChange"></FooterWidget>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref, getCurrentInstance } from 'vue';
import { PexelsClient, PexelsVideoSuccessModel, MediaType, PexelsPhotoSuccessModel } from '@/constants/PexelsClient';
import type { QueryEvent } from '@/constants/PexelsClient';
import FooterWidget from '../components/FooterWidget.vue';
import type { Video, Photo } from 'pexels';

import PhotoGridItem from '../PhotosPage/components/PhotoGridItem.vue';
import VideoGridItem from '../VideoPage/components/VideoGridItem.vue';
import PhotosListItem from '../PhotosPage/components/PhotosListItem.vue';
import VideoListItem from '../VideoPage/components/VideoListItem.vue';
import { ElMessage } from 'element-plus';

interface PhotoPageModel {
    [index: number]: Array<Photo>,
}
interface VideoPageModel {
    [index: number]: Array<Video>,
}

const loading = ref<boolean>(false);
const currentStyle = ref<string>('网格');
const styleList: string[] = ['网格', '列表'];
const currentMediaType = ref<MediaType>(MediaType.Photos);
const totalPage = ref(100);
const photoResult = reactive<PhotoPageModel>({});
const videoResult = reactive<VideoPageModel>({});
const per_page = 20;
const currentPageNo = ref<number>(1);
const instance = getCurrentInstance();
let $event: QueryEvent;


const onSearch = async (event: any) => {
    console.log('开始搜索:', event);
    $event = event as QueryEvent;
    currentPageNo.value = 1;
    currentMediaType.value = $event.type;
    resetData();
    await getSearchResutl($event, currentPageNo.value);
}

const getSearchResutl = async (event: QueryEvent, page: number) => {
    const type = event.type;
    const query = event.query;
    
    try {
        loading.value = true;
        if (type == MediaType.Video) {
            const result = await PexelsClient.videos.search({
                query: query,
                page: page,
                per_page: per_page,
            });
            console.log('video:result:',result);
            
            if (!PexelsVideoSuccessModel(result)) {
                ElMessage({
                    message: result.error,
                    type: 'warning',
                })
                return;
            }
            if (result.videos.length == 0) {
                ElMessage({
                    message: '没有更多数据了',
                    type: 'success',
                })
                return;
            }
            const list = videoResult[page] || [];
            list.push(...result.videos);
            videoResult[page] = list;
            totalPage.value = Math.ceil(result.total_results / result.per_page);

        } else {
            const result = await PexelsClient.photos.search({
                query: query,
                page: page,
                per_page: per_page,
            })

            if (!PexelsPhotoSuccessModel(result)) {
                ElMessage({
                    message: result.error,
                    type: 'warning',
                })
                return;
            }
            if (result.photos.length == 0) {
                ElMessage({
                    message: '没有更多数据了',
                    type: 'success',
                })
                return;
            }
            const list = photoResult[page] || [];
            list.push(...result.photos);
            photoResult[page] = list;
            totalPage.value = Math.ceil(result.total_results / result.per_page);
        }
    } catch (error) {
        ElMessage({
            message: `获取数据失败:${error}`,
            type: 'warning',
        });
    } finally {
        loading.value = false;
    }
}

function onCurrentChange(value: number): void {
    currentPageNo.value = value;
    const hasData = $event.type == MediaType.Video ? videoResult[currentPageNo.value] : photoResult[currentPageNo.value];
    if (!hasData) {
        getSearchResutl($event, currentPageNo.value);
    }
}

instance?.proxy?.$Bus.on('on-search', onSearch)

const handleSwitchStyle = (style: string) => {
    currentStyle.value = style
}

const resetData = () => {
    try {
        Object.keys(photoResult).forEach((key) => {
            delete photoResult[key as any];
        });
        Object.keys(videoResult).forEach((key) => {
            delete videoResult[key as any];
        });
    } catch (error) {
        console.log(error);
        
    }
}


</script>
<style lang="less" scoped>
.content-box {
    height: 82vh;
    margin: 1vh 0px;
    padding: 0px 10px;
    overflow: auto;
    position: relative;
}

.style-box {
    position: absolute;
    right: 1%;
    z-index: 100;
}

.grid-container {
    display: grid;
    /* 定义三列，并且每列都占据相同的空间 */
    grid-template-columns: repeat(5, 1fr);
    /* 相邻网格项之间的距离 */
    grid-gap: 10px;
}
</style>
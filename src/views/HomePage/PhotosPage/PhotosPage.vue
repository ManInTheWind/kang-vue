<template>
    <div class="content-box" v-loading="loading">
        <el-radio-group v-model="currentStyle" @change="handleSwitchStyle" class="style-box">
            <el-radio-button :key="item" v-for="item in styleList" :label="item">
            </el-radio-button>
        </el-radio-group>
        <div :class="[currentStyle == '网格' ? 'grid-container' : '']">
            <div :key="item.id" v-for="item in photoResult[currentPageNo]">
                <PhotoGridItem v-if="currentStyle == '网格'" :photo-item="item"></PhotoGridItem>
                <PhotoListItem v-else :photo-item="item"></PhotoListItem>
            </div>
        </div>
    </div>
    <FooterWidget :total-page="totalPage" @current-change="onCurrentChange"></FooterWidget>
</template>
<script setup lang="ts">
// import type { PhotoEntity } from '@/model/PhotoEntity';
import { onMounted, reactive, ref } from 'vue';
import PhotoListItem from './components/PhotosListItem.vue';
import PhotoGridItem from './components/PhotoGridItem.vue';
import { ElMessage } from 'element-plus';
import { PexelsClient, PexelsPhotoSuccessModel } from '@/constants/PexelsClient';
// import result from '@/assets/MockResult.json';
import FooterWidget from '../components/FooterWidget.vue';
import type { Photo } from 'pexels';
const totalPage = ref(100);
interface PhotoPageModel {
    [index: number]: Array<Photo>,
}
const photoResult = reactive<PhotoPageModel>({});
const loading = ref<boolean>(false);
const per_page = 20;
let currentPageNo = ref<number>(1);
const currentStyle = ref<string>('网格');
const styleList: string[] = ['网格', '列表'];
// const API_KEY = 'Io69DKOilxJgKjR6cJBll7gjI4yuuFq7Wx39akg8Sk9JCvUD5rpVRgbp';
onMounted(() => {
    if (Object.keys(photoResult).length == 0) {
        getData(currentPageNo.value);
    }
})
async function getData(pageNo: number) {
    try {

        loading.value = true;
        const result = await PexelsClient.photos.curated({
            page: pageNo,
            per_page: per_page,
        });
        if (PexelsPhotoSuccessModel(result)) {
            if (result.photos.length == 0) {
                ElMessage({
                    showClose: true,
                    message: '没有更多数据了',
                    type: 'success',
                });
                return;
            }
            const list: Photo[] = photoResult[pageNo] || [];
            list.push(...result.photos);
            photoResult[pageNo] = list;
            // totalPage.value = Math.ceil(result.total_results / result.per_page);
        } else {
            ElMessage({
                showClose: true,
                message: result.error,
                type: 'success',
            });
        }
    } catch (error) {
        ElMessage({
            showClose: true,
            message: `请求数据失败：${error}`,
            type: 'error',
        });
    } finally {
        loading.value = false;
    }
}
function onCurrentChange(value: number): void {
    currentPageNo.value = value;
    // const currentList = photoResult[$currentPageNo] ?? [];
    // const currentPageNo = currentList.length / per_page;
    // console.log("$currentPageNo:", $currentPageNo, "currentPageNo:", currentPageNo, 'value:', value);
    if (!photoResult[currentPageNo.value]) {
        getData(currentPageNo.value);
    }
}

const handleSwitchStyle = (style: string) => {
    currentStyle.value = style
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
<template>
    <div v-loading="loading" class="content-box">
        <div :key="index" v-for="(item, index) in curatedPhotoList">
            <PhotoItem :photo-item="item"></PhotoItem>
        </div>
    </div>

    <FooterWidget :total-page="totalPage"  @current-change="onCurrentChange"></FooterWidget>
</template>
<script setup lang="ts">
import type { PhotoEntity } from '@/model/PhotoEntity';
import { onMounted, reactive, ref } from 'vue';
import PhotoItem from './components/PhotosItem.vue';
import type { PexelsResultModel } from '@/model/PexelsResultModel';
import { ElMessage } from 'element-plus';
import { axios } from '@/service/axios';
import {PexelsConfig}  from '@/constants/pexel.config'
// import result from '@/assets/MockResult.json';
import FooterWidget from '../components/FooterWidget.vue';
const totalPage = ref(1);
const curatedPhotoList = reactive<PhotoEntity[]>([]);
const loading = ref<boolean>(false);
const per_page = 20;
// const API_KEY = 'Io69DKOilxJgKjR6cJBll7gjI4yuuFq7Wx39akg8Sk9JCvUD5rpVRgbp';
onMounted(() => {
    getData(1);
})
async function getData(pageNo: number) {
    try {
        loading.value = true;
        const URL = `https://api.pexels.com/v1/curated?page=${pageNo}&per_page=${per_page}`;
        const result = await axios.get<PexelsResultModel>(URL, PexelsConfig.API_KEY);
        console.log(result);

        if (result.photos.length > 0) {
            curatedPhotoList.push(...result.photos);
            totalPage.value = Math.ceil(result.total_results / result.per_page);
        } else {
            ElMessage({
                showClose: true,
                message: '没有更多数据了',
                type: 'success',
            });
        }
    } catch (error) {
        ElMessage({
            showClose: true,
            message: `请求数据失败：${error}`,
            type: 'success',
        });
    }finally{
        loading.value = false;
    }
}
function onCurrentChange(value: number): void {
    const currentPageNo =  curatedPhotoList.length / per_page;
    if(value < currentPageNo){
        return;
    }
    getData(value);
}

</script>
<style lang="less" scoped>
.content-box {
    height: 82vh;
    margin: 1vh 0px;
    overflow: auto;
}
</style>
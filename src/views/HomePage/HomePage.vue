<template>
    <el-row justify="center">
        <el-col>
            <HeaderWidget></HeaderWidget>
            <ContentWidget></ContentWidget>
        </el-col>
    </el-row>
</template>

<script setup lang='ts'>
import HeaderWidget from './components/HeaderWidget.vue';
import ContentWidget from './components/ContentWidget.vue';
</script>

<style lang="less" scoped></style>

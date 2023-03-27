<template>
    <el-row :span="24" justify="center" align="middle" class="box-card">
        <el-col :span="4">
            <el-row justify="center">
                <el-col :span="18">
                    <slot name="image">
                    </slot>
                </el-col>
            </el-row>
        </el-col>
        <el-col :span="20">
            <slot name="content">
            </slot>
        </el-col>
    </el-row>
</template>
<script setup lang="ts">

</script>
<style lang="less" scoped>
.box-card {
    background-color: var(--vt-c-black-soft);
    margin: 15px 15px 0px 15px;
    padding: 10px;
    border-radius: 15px;
}
</style>
<template>
    <div class="grid-item">
        <div class="image-box">
            <slot name="image">
            </slot>
        </div>
        <div class="description">
            <!-- description -->
            <slot name="description">
            </slot>
        </div>

        <!-- bar -->
        <div class="bottom">
            <slot name="bottom-leading"></slot>
            <slot name="bottom-trailing">
            </slot>
        </div>
    </div>
</template>
<script setup lang="ts">
</script>
<style lang="less" scoped>
.grid-item {
    padding: 15px;
    background-color: var(--vt-c-black-soft);
    text-align: center;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    height: 30vh;

    .image-box {
        flex-grow: 1;
    }
    .description{
        height: 50px;
        padding: 15px 8px;
    }

    .bottom {
        // margin-top: 13px;
        // line-height: 12px;
        display: flex;
        justify-content: space-between;
        align-content: stretch;
        align-items:center;
    }
}
</style>
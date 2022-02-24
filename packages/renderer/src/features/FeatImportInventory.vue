<script setup lang="ts">
import { NModal, useMessage } from 'naive-ui';
import { store } from '../stores/electron-store';
import { getInventory, parseExcel } from '../core';

import { FileInfo } from 'naive-ui/lib/upload/src/interface';

import AppUpload from '../components/AppUpload.vue';

defineProps(['showModal']);
const emit = defineEmits(['update:showModal']);

const message = useMessage();

const beforeUpload = async ({ file }: FileInfo) => {
  const fileBuf = await file?.arrayBuffer();
  const workbook = await parseExcel(fileBuf as ArrayBuffer);
  try {
    const yarns = await getInventory(workbook);
    if (yarns) emit('update:showModal', false);
    await store.set('yarns', yarns);
  } catch (error) {
    const { message: msg } = error as Error;
    message.error(msg);
  }
  return false;
};
</script>

<template>
  <n-modal
    style="width: 500px"
    :show="showModal"
    @update:show="(value: boolean) =>emit('update:showModal',value)"
    transform-origin="center"
    preset="card"
  >
    <template #header>
      <div>导入库存表</div>
    </template>
    <app-upload @before-upload="beforeUpload" />
  </n-modal>
</template>

<style scoped></style>

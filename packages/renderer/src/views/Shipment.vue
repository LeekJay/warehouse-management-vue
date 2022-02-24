<script setup lang="ts">
import { useMessage, NSpace } from 'naive-ui';
import { FileInfo } from 'naive-ui/lib/upload/src/interface';
import AppUpload from '../components/AppUpload.vue';
import { parseExcel, getShipment, getVarietry, getConsumption } from '../core';

const message = useMessage();

const beforeUpload = async ({ file }: FileInfo) => {
  const fileBuf = await file?.arrayBuffer();
  const workbook = await parseExcel(fileBuf as ArrayBuffer);
  try {
    const shipment = getShipment(workbook);
    const varietry = getVarietry(shipment);
    const consumption = getConsumption(shipment, varietry);
    console.log(consumption);
  } catch (error) {
    const { message: msg } = error as Error;
    message.error(msg);
  }
  return false;
};
</script>
<template>
  <n-space vertical align="center" :size="12">
    <n-space justify="center">
      <app-upload @before-upload="beforeUpload" />
    </n-space>
    123
  </n-space>
</template>

<style lang="scss"></style>

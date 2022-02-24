<script setup lang="ts">
import { NUpload, NUploadDragger, NIcon, NP, NText } from 'naive-ui';
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5';
import { FileInfo, OnBeforeUpload } from 'naive-ui/lib/upload/src/interface';

defineProps(['msg']);
const emit = defineEmits<{ (e: 'before-upload', file: FileInfo): void }>();

const beforeUpload: OnBeforeUpload = async ({ file }) => {
  emit('before-upload', file);
  return false;
};
</script>

<template>
  <n-upload :show-file-list="false" @before-upload="beforeUpload">
    <n-upload-dragger>
      <div class=".upload-icon">
        <n-icon size="48" :depth="3">
          <archive-icon />
        </n-icon>
      </div>
      <n-text class="upload-text">点击或者拖动文件到该区域来导入</n-text>
      <n-p class="upload-p" depth="3">
        请不要导入敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
      </n-p>
    </n-upload-dragger>
  </n-upload>
</template>

<style lang="scss" scoped>
.upload {
  &-icon {
    margin-bottom: 12px;
  }
  &-text {
    font-size: 16px;
  }
  &-p {
    margin-top: 8px;
  }
}
</style>

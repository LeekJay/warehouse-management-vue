<script setup lang="ts">
import FeatImportInventory from '../features/FeatImportInventory.vue';

import { h, ref } from 'vue';
import { NButton, NIcon, NSpace, NLayout, NLayoutSider, NMenu } from 'naive-ui';
import {
  CaretDownOutline as CaretDownIcon,
  AddCircleOutline as AddCircleIcon
} from '@vicons/ionicons5';

const collapsed = ref(false);
const showModal = ref(false);
// const menuValue = ref(null);

defineProps(['value', 'menuOptions']);
const emit = defineEmits(['update:value']);
</script>

<template>
  <n-space vertical>
    <n-layout has-sider>
      <n-layout-sider
        style="height: 100vh"
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-space vertical size="large">
          <div></div>
          <n-space justify="center">
            <n-button
              strong
              secondary
              round
              type="primary"
              :circle="collapsed"
              @click="showModal = true"
            >
              <template #icon v-if="collapsed">
                <n-icon>
                  <add-circle-icon />
                </n-icon>
              </template>
              <template #default v-if="!collapsed"> 导入库存表 </template>
            </n-button>
          </n-space>
          <n-menu
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
            :expand-icon="
              () => h(NIcon, null, { default: () => h(CaretDownIcon) })
            "
            :value="value"
            @update-value="(value: boolean) =>emit('update:value',value)"
          />
        </n-space>
      </n-layout-sider>
      <n-layout>
        <slot />
      </n-layout>
    </n-layout>
  </n-space>
  <feat-import-inventory v-model:show-modal="showModal" />
</template>

<style scoped></style>

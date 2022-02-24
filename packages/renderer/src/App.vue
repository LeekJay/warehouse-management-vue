<script setup lang="ts">
import { h, ref } from 'vue';
import { NIcon, NMessageProvider } from 'naive-ui';
import {
  HomeOutline as HomeIcon,
  FileTrayFullOutline as FileTrayFullIcon,
  ReaderOutline as ReaderIcon
} from '@vicons/ionicons5';
import AppMenu from './components/AppMenu.vue';
import Home from './views/Home.vue';
import Inventory from './views/Inventory.vue';
import Shipment from './views/Shipment.vue';

const menuValue = ref('home');

const menuOptions = [
  {
    label: '首页',
    key: 'home',
    icon: renderIcon(HomeIcon)
  },
  {
    label: '现有库存',
    key: 'inventory',
    icon: renderIcon(FileTrayFullIcon)
  },
  {
    label: '车间用纱',
    key: 'shipment',
    icon: renderIcon(ReaderIcon)
  }
];
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
</script>

<template>
  <n-message-provider>
    <!-- <home /> -->
    <app-menu v-model:value="menuValue" :menuOptions="menuOptions">
      <home v-if="menuValue === 'home'" />
      <inventory v-if="menuValue === 'inventory'" />
      <shipment v-if="menuValue === 'shipment'" />
    </app-menu>
  </n-message-provider>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
::-webkit-scrollbar {
  display: none;
}
</style>

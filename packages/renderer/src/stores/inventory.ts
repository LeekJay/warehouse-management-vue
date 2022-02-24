import { ref } from 'vue';
import { defineStore } from 'pinia';
import { CellValue } from 'exceljs';
import { store } from './electron-store';

export interface StockYarn {
  name: CellValue;
  batch: CellValue;
  warehouse: Warehouse[];
}

export interface Warehouse {
  name: CellValue;
  pieces: CellValue;
  kg: CellValue;
}

export const useInventoryStore = defineStore('inventory', () => {
  const yarns = ref<StockYarn[]>([]);
  async function getInventory() {
    yarns.value = await store.get('yarns');
  }

  return { yarns, getInventory };
});

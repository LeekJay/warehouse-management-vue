<script setup lang="ts">
import { h, ref, computed, onMounted } from 'vue';
import {
  NSpace,
  NTag,
  NButton,
  NAutoComplete,
  NDataTable,
  DataTableColumns
} from 'naive-ui';
import { StockYarn, Warehouse, useInventoryStore } from '../stores/inventory';
import _ from 'lodash';

const inventory = useInventoryStore();
const tableLodding = ref(false);
const yarnNameSearchValue = ref('');
const yarnBatchSearchValue = ref('');
const searchBtnText = computed(() => {
  return yarnNameSearchValue.value || yarnBatchSearchValue.value
    ? '搜索'
    : '刷新';
});

onMounted(async () => {
  await inventory.getInventory();
});

const yarnNameOptions = computed(() => {
  const varietry = _.uniqWith(
    inventory.yarns,
    (arrVal: StockYarn, othVal: StockYarn) => {
      return arrVal.name === othVal.name;
    }
  );
  const yarns = varietry.filter((yarn: StockYarn) => {
    if (String(yarn.name).includes(yarnNameSearchValue.value)) return yarn;
  });

  return yarns.map((yarn: StockYarn) => {
    return {
      label: String(yarn.name),
      value: String(yarn.name)
    };
  });
});

const yarnBatchOptions = computed(() => {
  const varietry = _.uniqWith(
    inventory.yarns,
    (arrVal: StockYarn, othVal: StockYarn) => {
      return arrVal.batch === othVal.batch;
    }
  );
  const yarns = varietry.filter((yarn: StockYarn) => {
    if (String(yarn.batch).includes(yarnBatchSearchValue.value)) return yarn;
  });
  return yarns.map((yarn: StockYarn) => {
    return {
      label: String(yarn.batch),
      value: String(yarn.batch)
    };
  });
});

async function onSearch() {
  tableLodding.value = true;
  await inventory.getInventory();
  if (yarnNameSearchValue.value && yarnBatchSearchValue.value) {
    inventory.yarns = inventory.yarns.filter(
      yarn =>
        String(yarn.name).includes(yarnNameSearchValue.value) &&
        String(yarn.batch).includes(yarnBatchSearchValue.value)
    );
  } else if (yarnNameSearchValue.value) {
    inventory.yarns = inventory.yarns.filter(yarn =>
      String(yarn.name).includes(yarnNameSearchValue.value)
    );
  } else if (yarnBatchSearchValue.value) {
    inventory.yarns = inventory.yarns.filter(yarn =>
      String(yarn.batch).includes(yarnBatchSearchValue.value)
    );
  }
  tableLodding.value = false;
}

async function onClear() {
  yarnNameSearchValue.value = '';
  yarnBatchSearchValue.value = '';
  await inventory.getInventory();
}

const columns: DataTableColumns<StockYarn> = [
  {
    title: '名称',
    key: 'name'
  },
  {
    title: '批号',
    key: 'batch'
  },
  {
    title: '库存',
    key: 'inventory',
    render(stockYarn: StockYarn) {
      const warehouses = stockYarn.warehouse.map((warehouse: Warehouse) => {
        const hasWarehouse = warehouse.name && warehouse.pieces && warehouse.kg;

        const name = String(warehouse.name);
        const warehouseName = name.includes('A4')
          ? 'default'
          : name.includes('B')
          ? 'error'
          : name.includes('A2')
          ? 'warning'
          : name.includes('A3')
          ? 'info'
          : 'success';

        if (hasWarehouse) {
          return h(
            NTag,
            {
              style: {
                marginRight: '6px'
              },
              size: 'small',
              type: warehouseName
            },
            {
              default: () => {
                return `${warehouse.name}:${warehouse.pieces}件${warehouse.kg}kg`;
              }
            }
          );
        }
      });

      return warehouses;
    }
  }
];
</script>

<template>
  <n-space
    style="height: 100vh"
    vertical
    :size="12"
    align="center"
    justify="start"
  >
    <n-space>
      <n-auto-complete
        :input-props="{
          autocomplete: 'disabled'
        }"
        :options="yarnNameOptions"
        v-model:value="yarnNameSearchValue"
        placeholder="品种"
      />
      <n-auto-complete
        :input-props="{
          autocomplete: 'disabled'
        }"
        :options="yarnBatchOptions"
        v-model:value="yarnBatchSearchValue"
        placeholder="批号"
      />
      <n-space>
        <n-button strong secondary type="primary" @click="onClear">
          清空
        </n-button>
        <n-button strong secondary type="primary" @click="onSearch">
          {{ searchBtnText }}
        </n-button>
      </n-space>
    </n-space>

    <n-data-table
      :loading="tableLodding"
      virtual-scroll
      max-height="89.5vh"
      :bordered="false"
      :columns="columns"
      :data="inventory.yarns"
      size="small"
    />
  </n-space>
</template>

<style scoped></style>

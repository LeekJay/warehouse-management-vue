import _ from 'lodash';

// Use 'electron-store'
export const store = {
  async get(key: string) {
    const { invoke } = window.ipcRenderer;
    let value = await invoke('electron-store', 'get', key);
    try {
      value = JSON.parse(value);
    } finally {
      return value;
    }
  },
  async set(key: string, value: any) {
    const { invoke } = window.ipcRenderer;
    let val = value;
    try {
      if (value && typeof value === 'object') {
        val = JSON.stringify(value);
      }
    } finally {
      await invoke('electron-store', 'set', key, val);
    }
  }
};

(async () => {
  const date = new Date().toLocaleDateString();
  store.set('date', date);

  console.log('electron-store ->', 'Date.now:', await store.get('date'));
  console.log(
    'electron-store ->',
    'path:',
    await window.ipcRenderer.invoke('electron-store', 'path')
  );
})();

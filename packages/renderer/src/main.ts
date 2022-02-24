import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import 'vfonts/FiraSans.css'

createApp(App).use(createPinia()).mount('#app').$nextTick(window.removeLoading);

// console.log('fs', window.fs)
// console.log('ipcRenderer', window.ipcRenderer)

// Usage of ipcRenderer.on
window.ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args);
});

import { createApp } from 'vue';
import App from './App.vue';
import store from './store'; // Imports the index.js from your store folder

const app = createApp(App);

// This is the line that fixes the error on your screen:
app.use(store); 

app.mount('#app');

import './assets/base.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from '@/router';
import * as Sentry from '@sentry/vue';

const app = createApp(App);
const pinia = createPinia();

Sentry.init({
  app,
  dsn: "https://963e479f7bf5ab7e198a346e0236848c@o4511302587187200.ingest.de.sentry.io/4511302595969104",
  sendDefaultPii: true,
});

// Use the plugin to persist the store
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);

app.mount('#app');

myUndefinedFunction();
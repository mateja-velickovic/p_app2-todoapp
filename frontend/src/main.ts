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
  dsn: "https://5e0049e4effbe663a55472c6021fdded@o4511302587187200.ingest.de.sentry.io/4511308006228048",
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Use the plugin to persist the store
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);

// Track router navigation
router.afterEach((to, from) => {
  if (to.path !== from.path) {
    Sentry.captureMessage(`Navigation: ${from.path} → ${to.path}`, 'info');
  }
});

app.mount('#app');


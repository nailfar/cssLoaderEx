import Vue from "vue";
import App from "./app";

import VueTsCss from "vue-css-ts";
Vue.use(VueTsCss);
Vue.config.productionTip = process.env.NODE_ENV === "development";
Vue.config.devtools = process.env.NODE_ENV === "development";
const app = new Vue({
  render: (h) => h(App),
}).$mount("#app");

window.onerror = (e) => {
  console.info("error:", e);
};

import Vue from "vue";
import Vuex from "vuex";
import feed from "@/components/feed/store";
import player from "@/components/player/store";

Vue.use(Vuex);
Vue.use(require("vue-shortkey"));

export default new Vuex.Store({
  modules: {
    feed,
    player,
  },
});

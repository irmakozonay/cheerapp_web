<template>
  <div id="app">
    <Feed />
    <Shortcuts />
    <Player />
    <Sounds />
  </div>
</template>

<script>
import Feed from "./components/feed/Feed.vue";
import Player from "./components/Player.vue";
import Shortcuts from "./components/Shortcuts.vue";
import Sounds from "./components/Sounds.vue";

export default {
  name: "App",
  components: {
    Feed,
    Player,
    Shortcuts,
    Sounds,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>

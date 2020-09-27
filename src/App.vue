<template>
  <div id="app">
    <Feed/>
    <Shortcuts/>
    <Player/>
    <Home/>
  </div>
</template>

<script>
import Home from './components/Home.vue'
import Feed from './components/feed/Feed.vue'
import Player from './components/player/Player.vue'
import Shortcuts from './components/Shortcuts.vue'

export default {
  name: 'App',
  components: {
    Home,
    Feed,
    Player,
    Shortcuts
  }
}
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

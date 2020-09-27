<template>
  <div>

    <p>Shortcuts</p>
    <button v-for="(type, index) in shortcutTypes" :key="type" v-shortkey.once="[shortcutKeys[index]]" @shortkey="playSoundType(type)" @click="playSoundType(type)">{{type}}</button>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { eventBus } from "../main.js";

export default {
  computed: {
    ...mapGetters('feed', [
      'feed',
      'feedSoundSubtypeMap'
    ])
  },
  data () {
    return {
        shortcutTypes: ['defence', 'attack', 'up', 'down'],
        shortcutKeys: ['arrowleft', 'arrowright', 'arrowup', 'arrowdown'],
    }
  },
  methods: {
    playSoundType(type){
        const sounds = this.feedSoundSubtypeMap[type][0]
        eventBus.$emit('addTrack-Player', {'name': type + ' shortcut', 'sounds': sounds});
    },
    theAction (type) {
        console.log('uuup-' + type)
    }
  }
}

</script>

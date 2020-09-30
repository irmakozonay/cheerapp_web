<template>
  <div>
    <p>Shortcuts</p>
    <button
      v-for="(type, index) in shortcutTypes"
      :key="type"
      v-shortkey.once="[shortcutKeys[index]]"
      @shortkey="playSoundType(type)"
      @click="playSoundType(type)"
    >
      {{ type }}
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { eventBus } from "../main.js";

export default {
  computed: {
    ...mapGetters("feed", ["feed", "feedSubtypeMap"]),
  },
  data() {
    return {
      shortcutTypes: ["defence", "attack", "up", "down"],
      shortcutKeys: ["arrowleft", "arrowright", "arrowup", "arrowdown"],
    };
  },
  methods: {
    playSoundType(type) {
      const gameFeed = this.feedSubtypeMap[type][0];
      eventBus.$emit("addTrack-Player", {
        id: gameFeed.id,
        name: type + " shortcut",
        sounds: gameFeed.sounds,
        type: type,
      });
    },
    theAction(type) {
      console.log("uuup-" + type);
    },
  },
};
</script>

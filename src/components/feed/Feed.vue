<template>
  <div>
    <p>Feed</p>
    <div v-for="(gameFeedArray, feedIndex) in feed" :key="feedIndex">
      <ul
        v-for="(gameFeed, gameFeedIndex) in gameFeedArray"
        :key="gameFeedIndex"
      >
        <li>
          <span>{{ gameFeed.text }}: </span>
          <!-- <button type="button" @click="playSound(soundMap.fileName)">{{soundsAudios[soundMap.fileName] == null ? 'Baslat' : 'Durdur'}}</button> -->
          <br />
          <button
            @click="
              addSounds(gameFeed.text, gameFeed.sounds, gameFeed.soundsType)
            "
          >
            Play
          </button>
          <!-- <input v-if="soundsAudios[soundMap.fileName] != null" type="range" min="0" max="100" v-model="soundsVolumeLevels[soundMap.fileName]" @change="onChangeSoundVolume(soundMap.fileName)" @input="onChangeSoundVolume(soundMap.fileName)"> -->
        </li>
      </ul>
    </div>
    <button @click="getFeed()">Get Feed</button>
  </div>
</template>

<script>
import axios from "axios";
import { mapActions, mapGetters } from "vuex";
import { eventBus } from "../../main.js";

export default {
  computed: {
    ...mapGetters("feed", ["feed"]),
  },
  data() {
    return {};
  },
  created() {
    //this.getFeed()
  },
  methods: {
    ...mapActions("feed", ["addFeed"]),
    addSounds(name, sounds, type) {
      eventBus.$emit("addTrack-Player", {
        name: name,
        sounds: sounds,
        type: type,
      });
    },
    getFeed() {
      axios
        .get("/games/1/feed")
        .then((response) => {
          const gameFeedArray = response.data;
          console.log(gameFeedArray);
          this.addFeed(gameFeedArray);
        })
        .catch((error) => {
          console.log(error);
        });
      //setTimeout(() => this.getFeed(), 10000); //30sn de bir data al
    },
  },
};
</script>
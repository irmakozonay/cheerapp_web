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
          <br />
          <button
            @click="
              trackOrder.includes(gameFeed.id)
                ? stopSounds(gameFeed.id)
                : addSounds(gameFeed)
            "
          >
            {{ trackOrder.includes(gameFeed.id) ? "Durdur" : "Baslat" }}
          </button>
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
    ...mapGetters("player", ["trackOrder"]),
  },
  data() {
    return {};
  },
  created() {
    //this.getFeed()
  },
  methods: {
    ...mapActions("feed", ["addFeed"]),
    addSounds(gameFeed) {
      eventBus.$emit("addTrack-Player", {
        id: gameFeed.id,
        name: gameFeed.text,
        sounds: gameFeed.sounds,
        type: gameFeed.soundsType,
      });
    },
    stopSounds(trackId) {
      eventBus.$emit("stopTrack-Player", trackId);
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
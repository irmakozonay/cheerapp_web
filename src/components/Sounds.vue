<template>
  <div>
    <table v-for="(soundsArray, type) in sounds" :key="type">
      <h4>{{ type }}</h4>
      <ul v-for="(soundMap, soundIndex) in soundsArray" :key="soundIndex">
        <li>
          <span>{{ soundIndex + 1 }}. {{ soundMap.name }}: </span>
          <button
            @click="
              trackOrder.includes(soundMap.id)
                ? stopSounds(soundMap.id)
                : addSounds(soundMap, type)
            "
          >
            {{ trackOrder.includes(soundMap.id) ? "Durdur" : "Baslat" }}
          </button>
          <br />
        </li>
      </ul>
    </table>
  </div>
</template>

<script>
import { eventBus } from "../main.js";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("player", ["trackOrder"]),
  },
  data() {
    return {
      sounds: {
        Mars: [
          { id: 1, name: "12 Dev Adam", fileName: "12DevAdam.m4a" },
          { id: 2, name: "12 Dev Adam 2", fileName: "12DevAdam_2.m4a" },
        ],
        Tezahurat: [
          { id: 3, name: "Sari - Kirmizi", fileName: "sarikirmizi.m4a" },
          {
            id: 4,
            name: "Sari - Kirmizi Stereo",
            fileName: "sarikirmizi_stereo.m4a",
          },
          { id: 5, name: "Kirmizi - Beyaz", fileName: "kirmizibeyaz.m4a" },
          {
            id: 6,
            name: "Kirmizi - Beyaz Stereo",
            fileName: "kirmizibeyaz_stereo.m4a",
          },
        ],
        Tepki: [
          { id: 7, name: "Alkis", fileName: "alkis.m4a" },
          { id: 8, name: "Islik", fileName: "islik.m4a" },
          { id: 9, name: "Yuh", fileName: "yuh.m4a" },
        ],
        Gurultu: [
          { id: 10, name: "Crowd Football", fileName: "crowd_football.m4a" },
          { id: 11, name: "Crowd Football 2", fileName: "crowd_football2.m4a" },
        ],
      },
      shotcutKeys: { M: "Mars", T: "Tezahurat", Y: "Tepki", G: "Gurultu" },
      shortkeyListener: null,
      previousKey: "",
    };
  },
  methods: {
    theAction(event) {
      console.log(event.srcKey);
    },
    addSounds(sound, type) {
      eventBus.$emit("addTrack-Player", {
        id: sound.id,
        name: sound.name,
        sounds: [sound],
        type: type,
      });
    },
    stopSounds(trackId) {
      eventBus.$emit("stopTrack-Player", trackId);
    },
    addShortkeyListener() {
      this.shortkeyListener = window.addEventListener("keydown", (e) => {
        const number = e.keyCode - 48;
        const type = this.shotcutKeys[this.previousKey];
        if (type != null && number > -1 && number < 10) {
          var soundMap = this.sounds[type][number - 1];
          this.addSounds(soundMap.name, soundMap, type);
          console.log(type + " " + number);
        }
        this.previousKey = String.fromCharCode(e.keyCode);
      });
    },
    removeShortkeyListener() {
      window.removeEventListener("keydown", this.shortkeyListener);
    },
  },
  created() {
    this.addShortkeyListener();
  },
  beforeDestroy() {
    this.removeShortkeyListener();
  },
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 10px;
  border: 1px solid black;
}
table {
  display: inline-table;
  margin: 0 10px;
  width: 180px;
}
</style>
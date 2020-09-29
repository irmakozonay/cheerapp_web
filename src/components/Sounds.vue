<template>
  <div>
    <table v-for="(soundsArray, type) in sounds" :key="type">
      <h4>{{ type }}</h4>
      <ul v-for="(soundMap, soundIndex) in soundsArray" :key="soundIndex">
        <li>
          <span>{{ soundIndex + 1 }}. {{ soundMap.name }}: </span>
          <button @click="addSounds(soundMap.name, soundMap, type)">
            Baslat
          </button>
          <br />
        </li>
      </ul>
    </table>
  </div>
</template>

<script>
import { eventBus } from "../main.js";

export default {
  data() {
    return {
      sounds: {
        Mars: [
          { name: "12 Dev Adam", fileName: "12DevAdam.m4a" },
          { name: "12 Dev Adam 2", fileName: "12DevAdam_2.m4a" },
        ],
        Tezahurat: [
          { name: "Sari - Kirmizi", fileName: "sarikirmizi.m4a" },
          { name: "Sari - Kirmizi Stereo", fileName: "sarikirmizi_stereo.m4a" },
          { name: "Kirmizi - Beyaz", fileName: "kirmizibeyaz.m4a" },
          {
            name: "Kirmizi - Beyaz Stereo",
            fileName: "kirmizibeyaz_stereo.m4a",
          },
        ],
        Tepki: [
          { name: "Alkis", fileName: "alkis.m4a" },
          { name: "Islik", fileName: "islik.m4a" },
          { name: "Yuh", fileName: "yuh.m4a" },
        ],
        Gurultu: [
          { name: "Crowd Football", fileName: "crowd_football.m4a" },
          { name: "Crowd Football 2", fileName: "crowd_football2.m4a" },
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
    addSounds(name, sound, type) {
      eventBus.$emit("addTrack-Player", {
        name: name,
        sounds: [sound],
        type: type,
      });
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
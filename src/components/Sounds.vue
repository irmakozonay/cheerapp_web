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
      shortkeyListener: null,
      previousKey: -1,
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
        if (this.previousKey == 77 && e.keyCode > 47 && e.keyCode < 58) {
          //m 0 - 9
          console.log("mars " + (e.keyCode - 48));
        }
        this.previousKey = e.keyCode;
        console.log(e.keyCode);
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
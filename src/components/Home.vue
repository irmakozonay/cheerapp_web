<template>
  <div>
    <table v-for="(soundsArray, type) in sounds" :key="type">
      <h4>{{ type }}</h4>
      <ul v-for="soundMap in soundsArray" :key="soundMap.name">
        <li>
          <span>{{ soundMap.name }}: </span>
          <button type="button" @click="playSound(soundMap.fileName)">
            {{ soundsAudios[soundMap.fileName] == null ? "Baslat" : "Durdur" }}
          </button>
          <br />
          <input
            v-if="soundsAudios[soundMap.fileName] != null"
            type="range"
            min="0"
            max="100"
            v-model="soundsVolumeLevels[soundMap.fileName]"
            @change="onChangeSoundVolume(soundMap.fileName)"
            @input="onChangeSoundVolume(soundMap.fileName)"
          />
        </li>
      </ul>
    </table>

    <br />

    <h3>Canli Yayin</h3>
    <button type="button" @click="startLive()">
      {{ liveActive ? "Canli Yayin Aktif" : "Canli Yayini Baslat" }}
    </button>
    <br />
    <input
      type="range"
      min="0"
      max="100"
      v-model="liveVolumeLevel"
      @change="changeLiveVolume()"
      @input="changeLiveVolume()"
    />

    <div v-if="liveActive">
      <table v-for="(cheerGroupIds, type) in cheerGroups" :key="type">
        <h3>{{ type }}</h3>
        <button @click="changeMuteLiveType(type)">
          {{ liveTypeMuted[type] ? "Sesleri Ac" : "Sesleri Kapat" }}
        </button>
        <ul v-for="cheerGroupId in cheerGroupIds" :key="cheerGroupId">
          <span>{{ cheerGroupId }}: </span>
          <input
            type="range"
            min="0"
            max="100"
            v-model="liveGroupsVolumeLevels[cheerGroupId]"
            @change="
              changeLiveGroupVolume(
                cheerGroupId,
                liveGroupsVolumeLevels[cheerGroupId]
              )
            "
            @input="
              changeLiveGroupVolume(
                cheerGroupId,
                liveGroupsVolumeLevels[cheerGroupId]
              )
            "
          />
        </ul>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

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
        Alkis: [
          { name: "Alkis", fileName: "alkis.m4a" },
          { name: "Alkis2", fileName: "alkis2.m4a" },
          { name: "Alkis4", fileName: "alkis4.m4a" },
          { name: "Alkis6", fileName: "alkis6.m4a" },
          { name: "Alkis8", fileName: "alkis8.m4a" },
          { name: "Alkis10", fileName: "alkis10.m4a" },
        ],
        Islik: [
          { name: "Islik", fileName: "islik.m4a" },
          { name: "Islik2", fileName: "islik2.m4a" },
          { name: "Islik4", fileName: "islik4.m4a" },
          { name: "Islik6", fileName: "islik6.m4a" },
          { name: "Islik8", fileName: "islik8.m4a" },
          { name: "Islik10", fileName: "islik10.m4a" },
        ],
        Yuh: [
          { name: "Yuh", fileName: "yuh.m4a" },
          { name: "Yuh2", fileName: "yuh2.m4a" },
          { name: "Yuh4", fileName: "yuh4.m4a" },
          { name: "Yuh6", fileName: "yuh6.m4a" },
          { name: "Yuh8", fileName: "yuh8.m4a" },
          { name: "Yuh10", fileName: "yuh10.m4a" },
        ],
        Gurultu: [
          { name: "Crowd Football", fileName: "crowd_football.m4a" },
          { name: "Crowd Football 2", fileName: "crowd_football2.m4a" },
        ],
      },
      soundsVolumeLevels: {},
      soundsAudios: {},

      liveActive: false,
      liveVolumeLevel: 100,
      nextSounds: [],
      previousSounds: [],
      activeLiveAudios: [],
      playNextSoundTimeout: null,
      loadNextSoundTimeout: null,

      liveTypeMuted: { defence: false, attack: false },
      liveGroupsVolumeLevels: {},
      lastLiveGroupsVolumeLevels: {},
      cheerGroups: { defence: ["islik", "yuh"], attack: ["alkis"] },
    };
  },
  methods: {
    onChangeSoundVolume(fileName) {
      this.soundsAudios[fileName].volume =
        this.soundsVolumeLevels[fileName] / 100;
    },
    playSound(fileName) {
      if (this.soundsAudios[fileName] == null) {
        const audio = new Audio("sounds/" + fileName);
        this.$set(this.soundsAudios, fileName, audio);
        audio.play();
        this.soundsVolumeLevels[fileName] = 100;
        for (const iterator in this.soundsAudios) {
          console.log("st " + iterator);
        }

        var self = this;
        audio.addEventListener("ended", function () {
          console.log("endde");
          self.$set(self.soundsAudios, fileName, null);
        });
      } else {
        this.soundsAudios[fileName].pause();
        this.$set(this.soundsAudios, fileName, null);
      }
    },
    startLive() {
      this.liveActive = !this.liveActive;
      if (this.liveActive) {
        this.getNextLiveCheer();
      } else {
        clearTimeout(this.playNextSoundTimeout);
        clearTimeout(this.loadNextSoundTimeout);
        this.stopActiveSounds();
      }
    },
    changeLiveVolume() {
      this.activeLiveAudios.forEach((map) => {
        map.audio.volume = this.liveVolumeLevel / 100;
      });
    },
    getNextLiveCheer() {
      console.log("getNextLiveCheer");
      if (this.liveActive) {
        axios
          .get("/cheer/next")
          .then((response) => {
            this.nextSounds = [];
            var soundsArray = response.data;
            for (let i = 0; i < soundsArray.length; ++i) {
              //i++ ???????
              this.nextSounds.push(soundsArray[i]);
              console.log("nextSounds: " + soundsArray[i].fileName);
            }
            this.processNextSounds();
          })
          .catch((error) => {
            console.log(error);
          });
        setTimeout(() => this.getNextLiveCheer(), 2000); //2sn de bir data al
      }
    },
    processNextSounds() {
      if (this.activeLiveAudios.length == 0) {
        //his canli ses yoksa
        console.log("----------List bos oynat---------");
        this.playNextSound();
      } else if (
        !this.areArraysEqual() &&
        this.activeLiveAudios[0].audio.duration -
          this.activeLiveAudios[0].audio.currentTime <
          5
      ) {
        //5. snden sonra ses dosyasi degisirse
        console.log("NEW sounds");
        clearTimeout(this.playNextSoundTimeout);
        clearTimeout(this.loadNextSoundTimeout);
        this.activeLiveAudios.forEach((map) => {
          //active sound objelerine dokunmadan sadece audiolar ustunden. active soundlar degisecek.
          setTimeout(() => {
            map.audio.pause();
            console.log("FADEOUT sound:" + map.fileName);
          }, 1000);
        });
        this.playNextSound();
      } else {
        //ses dosyasi degismiyorsa
        console.log("Liste dolu bekle nextSounds:" + this.nextSounds.length);
        var startDelay =
          (this.activeLiveAudios[0].audio.duration -
            this.activeLiveAudios[0].audio.currentTime) *
          1000;
        console.log("delay:" + startDelay);
        clearTimeout(this.playNextSoundTimeout);
        clearTimeout(this.loadNextSoundTimeout);
        this.loadNextSoundTimeout = setTimeout(
          () => this.loadNextSound(),
          startDelay - 250
        );
        this.playNextSoundTimeout = setTimeout(
          () => this.playNextSound(),
          startDelay - 1000
        ); //suankiler bittikten sonra
      }
      this.previousSounds = this.nextSounds;
    },
    areArraysEqual() {
      var array1 = [];
      var array2 = [];
      this.nextSounds.forEach((sound) => {
        array1.push(sound.fileName);
      });
      this.previousSounds.forEach((sound) => {
        array2.push(sound.fileName);
      });
      if (
        array1.length == 0 ||
        array2.length == 0 ||
        array1.length != array2.length
      ) {
        return false;
      }
      for (let i = 0; i < array1.length; i++) {
        const index = array2.indexOf(array1[i]);
        if (index > -1) {
          array2.splice(index, 1);
        }
      }
      return array2.length == 0;
    },
    playNextSound() {
      this.activeLiveAudios = [];
      console.log("clear activeLiveAudios - playNextSound");
      this.nextSounds.forEach((sound) => {
        const audio = new Audio("sounds/" + sound.fileName + "");
        console.log("play:" + sound.fileName);
        const groupId = sound.groupId;
        this.activeLiveAudios.push({ groupId, audio });
        audio.volume = 0;
        if (this.liveGroupsVolumeLevels[groupId] == null) {
          this.$set(this.liveGroupsVolumeLevels, groupId, 100);
          this.$set(this.lastLiveGroupsVolumeLevels, groupId, 100);
          this.fadeInAudio(audio, 1);
        } else {
          this.fadeInAudio(audio, this.liveGroupsVolumeLevels[groupId] / 100);
        }
        audio.play();
        var self = this;
        audio.addEventListener("loadeddata", function () {
          console.log("Audio data loaded set fadeout");
          self.fadeOutAudio(audio, audio.duration - 1.0);
        });
      });
    },
    loadNextSound() {
      this.nextSounds.forEach((sound) => {
        const audio = new Audio("sounds/" + sound.fileName + "");
        console.log("load:" + sound.fileName);
        audio.load();
      });
    },
    stopActiveSounds() {
      this.activeLiveAudios.forEach((map) => {
        map.audio.pause();
      });
      this.activeLiveAudios = [];
      console.log("clear activeLiveAudios - stopActiveSounds");
    },

    changeMuteLiveType(type) {
      this.liveTypeMuted[type] = !this.liveTypeMuted[type];
      for (let i = 0; i < this.cheerGroups[type].length; i++) {
        const cheerGroupId = this.cheerGroups[type][i];
        console.log("console:" + cheerGroupId);
        if (this.liveTypeMuted[type]) {
          this.lastLiveGroupsVolumeLevels[
            cheerGroupId
          ] = this.liveGroupsVolumeLevels[cheerGroupId];
        }
        console.log(
          cheerGroupId +
            " - " +
            this.liveTypeMuted[type] +
            " - " +
            this.lastLiveGroupsVolumeLevels[cheerGroupId] +
            " - result:" +
            (this.liveTypeMuted[type]
              ? 0
              : this.lastLiveGroupsVolumeLevels[cheerGroupId])
        );
        this.changeLiveGroupVolume(
          cheerGroupId,
          this.liveTypeMuted[type]
            ? 0
            : this.lastLiveGroupsVolumeLevels[cheerGroupId]
        );
      }
    },
    changeLiveGroupVolume(groupId, value) {
      console.log(groupId + " - " + value);
      this.liveGroupsVolumeLevels[groupId] = value;
      console.log(
        "liveGroupsVolumeLevels:" +
          this.liveGroupsVolumeLevels[groupId] +
          " groupId:" +
          groupId
      );
      this.activeLiveAudios.forEach((map) => {
        if (map.groupId == groupId) {
          map.audio.volume = value / 100;
        }
      });
    },
    fadeOutAudio(audio, fadePoint) {
      var fadeAudio = setInterval(function () {
        //var volume = audio.volume; //todo
        if (audio.currentTime >= fadePoint && audio.volume != 0.0) {
          audio.volume -= 0.1;
        }
        if (audio.volume <= 0.05 || audio.paused) {
          clearInterval(fadeAudio);
        }
      }, 100);
    },
    fadeInAudio(audio, volumeLevel) {
      var fadeAudio = setInterval(function () {
        if (audio.currentTime <= 1.0 && audio.volume != volumeLevel) {
          audio.volume += 0.1;
        }
        if (audio.volume >= volumeLevel - 0.05 || audio.paused) {
          clearInterval(fadeAudio);
        }
      }, 100);
    },
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

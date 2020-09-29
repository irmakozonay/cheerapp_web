<template>
  <div>
    <p>Player</p>
    <ul v-for="trackId in trackOrder" :key="trackId">
      <li>
        <span>{{ tracks[trackId].name }}: </span>
        <button type="button" @click="stopTrack(tracks[trackId])">
          Durdur
        </button>
        <br />
        <input
          type="range"
          min="0"
          max="100"
          v-model="trackVolumes[trackId]"
          @change="onChangeSoundVolume(tracks[trackId])"
          @input="onChangeSoundVolume(tracks[trackId])"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { eventBus } from "../main.js";

export default {
  created() {
    eventBus.$on("addTrack-Player", (track) => {
      this.addTrack(track);
    });
  },
  data() {
    return {
      tracks: {},
      trackOrder: [],
      trackVolumes: {},
    };
  },
  methods: {
    addTrack(track) {
      this.stopSimilarTracks(track);
      track["id"] = Date.now();
      console.log("add" + track.id);
      var sounds = track.sounds.slice();
      if (track.type == "up") {
        sounds.push({ fileName: "applause_mid_1.m4a" });
      }
      track.sounds = sounds;
      this.tracks[track.id] = track;
      this.trackOrder.splice(0, 0, track.id);
      this.playTrack(track);
    },
    stopSimilarTracks(track) {
      if (track.type == "Mars" || track.type == "Tezahurat") {
        for (const activeTrackId in this.tracks) {
          const activeTrack = this.tracks[activeTrackId];
          if (activeTrack.type == "Mars" || activeTrack.type == "Tezahurat") {
            this.stopTrack(activeTrack);
          }
        }
      }
    },
    onChangeSoundVolume(track) {
      track.sounds.forEach((item) => {
        item.audio.volume = this.trackVolumes[track.id] / 100;
      });
    },
    stopTrack(track) {
      track.sounds.forEach((item) => {
        console.log(item.audio);
        item.audio.pause();
      });
      console.log("remove" + track.id);
      this.removeTrack(track);
    },
    playTrack(track) {
      const sounds = track.sounds;
      for (let i = 0; i < sounds.length; i++) {
        const sound = sounds[i];
        const audio = new Audio("sounds/" + sound.fileName);
        sound["audio"] = audio;
        audio.play();
        this.trackVolumes[track.id] = 100;
      }
      setTimeout(() => this.setRemoveTrackTimeout(track), 50);
    },
    setRemoveTrackTimeout(track) {
      console.log("-----");
      var longestAudioDuration = 0;
      track.sounds.forEach((item) => {
        console.log(item.audio.duration);
        if (!item.audio.paused && item.audio.duration > longestAudioDuration) {
          longestAudioDuration = item.audio.duration;
        }
      });
      setTimeout(() => this.removeTrack(track), longestAudioDuration * 1000);
    },
    removeTrack(track) {
      for (let i = 0; i < this.trackOrder.length; i++) {
        if (this.trackOrder[i] == track.id) {
          this.trackOrder.splice(i, 1);
          break;
        }
      }
      this.$delete(this.tracks, track.id);
    },
  },
};
</script>
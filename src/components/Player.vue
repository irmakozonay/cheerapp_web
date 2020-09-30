<template>
  <div>
    <p>Player</p>
    <ul v-for="trackId in trackOrder" :key="trackId">
      <li>
        <span>{{ tracks[trackId].name }}: </span>
        <button type="button" @click="stopTrack(tracks[trackId], 'fadeOut')">
          Durdur
        </button>
        <br />
        <input
          type="range"
          min="0"
          max="100"
          v-model="trackVolumes[trackId]"
          @change="onChangeTrackVolume(tracks[trackId])"
          @input="onChangeTrackVolume(tracks[trackId])"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { eventBus } from "../main.js";
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("player", ["trackOrder"]),
  },
  created() {
    eventBus.$on("addTrack-Player", (track) => {
      this.addTrack(track);
    });
    eventBus.$on("stopTrack-Player", (trackId) => {
      this.stopTrack(this.tracks[trackId], "fadeOut");
    });
  },
  data() {
    return {
      tracks: {},
      trackVolumes: {},
      audioFileNameTracks: {},
    };
  },
  methods: {
    ...mapActions("player", ["addToTrackOrder", "removeFromTrackOrder"]),
    addTrack(track) {
      this.stopSimilarTracks(track);
      console.log("add" + track.id);
      var sounds = track.sounds.slice();
      if (track.type == "up") {
        sounds.push({ fileName: "applause_mid_1.m4a" });
      }
      track.sounds = sounds;
      this.tracks[track.id] = track;
      this.addToTrackOrder(track);
      this.playTrack(track);
    },
    stopSimilarTracks(track) {
      this.stopSameAudios(track);
      if (track.type == "Mars" || track.type == "Tezahurat") {
        for (const activeTrackId in this.tracks) {
          const activeTrack = this.tracks[activeTrackId];
          if (activeTrack.type == "Mars" || activeTrack.type == "Tezahurat") {
            this.stopTrack(activeTrack, "fadeOut");
          }
        }
      } else if (
        track.type == "defence" ||
        track.type == "attack" ||
        track.type == "up" ||
        track.type == "down"
      ) {
        for (const activeTrackId in this.tracks) {
          const activeTrack = this.tracks[activeTrackId];
          if (
            activeTrack.type == "defence" ||
            activeTrack.type == "attack" ||
            activeTrack.type == "up" ||
            activeTrack.type == "down"
          ) {
            this.stopTrack(activeTrack, "fadeOut");
          }
        }
      }
    },
    onChangeTrackVolume(track) {
      track.sounds.forEach((item) => {
        item.audio.volume = this.trackVolumes[track.id] / 100;
      });
    },
    stopSameAudios(track) {
      //bir filanemeden iki kere oynatinca ikisi de durdurulamiyor
      for (let index = 0; index < track.sounds.length; index++) {
        const sound = track.sounds[index];
        const sameTrack = this.audioFileNameTracks[sound.fileName];
        if (sameTrack != null) {
          this.stopTrack(sameTrack, "now"); //pause right away if same audio plays
          break;
        }
      }
    },
    stopTrack(track, nowOrFadeOut) {
      if (nowOrFadeOut == "now") {
        track.sounds.forEach((item) => {
          item.audio.pause();
        });
        this.removeTrack(track);
      } else {
        this.fadeOutAudio(track, 0);
      }
    },
    playTrack(track) {
      const sounds = track.sounds;
      for (let i = 0; i < sounds.length; i++) {
        const sound = sounds[i];
        const audio = new Audio("sounds/" + sound.fileName);
        this.audioFileNameTracks[sound.fileName] = track;
        sound["audio"] = audio;
        audio.play();
        this.trackVolumes[track.id] = 100;
      }
      setTimeout(() => this.setRemoveTrackTimeout(track), 50);
    },
    setRemoveTrackTimeout(track) {
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
      track.sounds.forEach((sound) => {
        delete this.audioFileNameTracks[sound.fileName];
      });
      this.removeFromTrackOrder(track);
      this.$delete(this.tracks, track.id);
      this.$delete(this.trackVolumes, track.id);
    },
    fadeOutAudio(track, fadePoint) {
      this.removeTrack(track);
      track.sounds.forEach((item) => {
        const audio = item.audio;
        var fadeAudio = setInterval(function () {
          const resultVolume = audio.volume - 0.1;
          if (audio.currentTime >= fadePoint && resultVolume > 0) {
            audio.volume = resultVolume;
          }
          if (resultVolume <= 0.05 || audio.paused) {
            clearInterval(fadeAudio);
            item.audio.pause();
          }
        }, 100);
      });
    },
  },
};
</script>
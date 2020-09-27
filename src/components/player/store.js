/*export default {
  namespaced: true,
  state: {
    tracks: []
  },
  getters: {
    tracks: state => state.tracks
  },
  actions: {
    addTrack ({commit}, track) { //{'name': name, 'sounds': sounds}
      track['id'] = Date.now()
      commit('ADD_TRACK', track)
    },
    removeTrack ({commit}, track) {
      commit('REMOVE_TRACK', track)
    },
  },
  mutations: {
    ADD_TRACK (state, track) {
      console.log(track)
      state.tracks.splice(0, 0, track)
    },
    REMOVE_TRACK (state, track) {
      for (let i = 0; i < state.tracks; i++) {
        if (state.tracks.id == track.id) {
          state.tracks.splice(i, 1);
          break;
        }
      }
    }
  }
}*/
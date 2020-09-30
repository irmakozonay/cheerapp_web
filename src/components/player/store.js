export default {
  namespaced: true,
  state: {
    trackOrder: [],
  },
  getters: {
    trackOrder: (state) => state.trackOrder,
  },
  actions: {
    addToTrackOrder({ commit }, track) {
      commit("ADD_TO_TRACK_ORDER", track);
    },
    removeFromTrackOrder({ commit }, track) {
      commit("REMOVE_FROM_TRACK_ORDER", track);
    },
  },
  mutations: {
    ADD_TO_TRACK_ORDER(state, track) {
      state.trackOrder.splice(0, 0, track.id);
    },
    REMOVE_FROM_TRACK_ORDER(state, track) {
      for (let i = 0; i < state.trackOrder.length; i++) {
        if (state.trackOrder[i] == track.id) {
          state.trackOrder.splice(i, 1);
          break;
        }
      }
    },
  },
};

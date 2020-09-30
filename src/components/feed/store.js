export default {
  namespaced: true,
  state: {
    feed: [],
    feedSubtypeMap: {}, //<subtype, [allGameFeedSounds]>
  },
  getters: {
    feed: (state) => state.feed,
    feedSubtypeMap: (state) => state.feedSubtypeMap,
  },
  actions: {
    addFeed({ commit }, gameFeedArray) {
      //{'name': name, 'sounds': sounds}
      if (gameFeedArray.length != 0) {
        commit("ADD_FEED", gameFeedArray);
      }
    },
  },
  mutations: {
    ADD_FEED(state, gameFeedArray) {
      state.feed.splice(0, 0, gameFeedArray);
      for (let i = 0; i < gameFeedArray.length; ++i) {
        const gameFeed = gameFeedArray[i];
        var subtypeFeed = state.feedSubtypeMap[gameFeed.soundsType];
        if (subtypeFeed == null) {
          subtypeFeed = [];
        }
        subtypeFeed.splice(0, 0, gameFeed);
        state.feedSubtypeMap[gameFeed.soundsType] = subtypeFeed;
      }
    },
  },
};

export default {
    namespaced: true,
    state: {
      feed: [],
      feedSoundSubtypeMap: {} //<subtype, [allGameFeedSounds]>
    },
    getters: {
        feed: state => state.feed,
        feedSoundSubtypeMap: state => state.feedSoundSubtypeMap
    },
    actions: {
      addFeed({commit}, gameFeedArray) { //{'name': name, 'sounds': sounds}
        if (gameFeedArray.length != 0) {
            commit('ADD_FEED', gameFeedArray)
        }
      }
    },
    mutations: {
       ADD_FEED (state, gameFeedArray) {
        state.feed.splice(0, 0, gameFeedArray);
        for (let i = 0; i < gameFeedArray.length; ++i) {
            const gameFeed = gameFeedArray[i]
            var subtypeSounds = state.feedSoundSubtypeMap[gameFeed.soundsType]
            if (subtypeSounds == null) {
                subtypeSounds = []
            }
            subtypeSounds.splice(0, 0, gameFeed.sounds)
            state.feedSoundSubtypeMap[gameFeed.soundsType] = subtypeSounds
        }
      }
    }
}
import { createStore } from 'vuex';

export default createStore({
  // Centralized single source of truth for your mini-arcade
  state() {
    return {
      gameScore: 0,
      difficultyLevel: 1,
      highScore: 0
    };
  },

  // Synchronous state mutators (The only files allowed to rewrite data)
  mutations: {
    INCREMENT_SCORE(state) {
      state.gameScore += 1;
      // Dynamically update personal highscore benchmarks on the fly
      if (state.gameScore > state.highScore) {
        state.highScore = state.gameScore;
      }
    },
    SET_DIFFICULTY(state, payloadLevel) {
      state.difficultyLevel = payloadLevel;
    },
    RESET_GAME_STATE(state) {
      state.gameScore = 0;
      state.difficultyLevel = 1;
    }
  },

  // Asynchronous controllers that dispatch logic commands
  actions: {
    addScore({ commit }) {
      console.log("[Vuex Action Triggered]: Processing player point...");
      commit('INCREMENT_SCORE');
    },
    changeDifficulty({ commit }, level) {
      console.log(`[Vuex Action Triggered]: Scaling difficulty to Level ${level}`);
      commit('SET_DIFFICULTY', level);
    },
    resetGameStore({ commit }) {
      console.log("[Vuex Action Triggered]: Purging runtime performance states...");
      commit('RESET_GAME_STATE');
    }
  },

  // Optimized pipeline filters to feed clean read-only data straight to components
  getters: {
    currentScore: (state) => state.gameScore,
    currentDifficulty: (state) => state.difficultyLevel,
    personalBest: (state) => state.highScore
  }
});

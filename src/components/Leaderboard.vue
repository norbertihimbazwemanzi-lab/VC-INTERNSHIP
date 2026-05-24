<template>
  <div class="leaderboard-box">
    <h3>🏆 Cloud Leaderboard 🏆</h3>
    <button @click="loadScores" class="refresh-btn">🔄 Refresh Rankings</button>
    
    <div v-if="loading" class="loading-text">Connecting to server...</div>
    
    <ol v-else class="score-list">
      <li v-for="player in topScores" :key="player.rank" class="score-item">
        <span class="player-rank">#{{ player.rank }}</span>
        <span class="player-name">{{ player.name }}</span>
        <span class="player-score">{{ player.highScore }} pts</span>
      </li>
    </ol>
  </div>
</template>

<script>
// FIX: Corrected folder trajectory tracking from components to services
import gameService from '../services/gameServices';

export default {
  name: "GameLeaderboard",
  data() {
    return {
      topScores: [],
      loading: false
    };
  },
  mounted() {
    this.loadScores();
  },
  methods: {
    async loadScores() {
      this.loading = true;
      try {
        this.topScores = await gameService.fetchHighScores();
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.leaderboard-box {
  margin-top: 25px;
  background-color: #2c3e50;
  color: white;
  padding: 15px;
  border-radius: 6px;
  width: 600px;
  box-sizing: border-box;
}
h3 { margin: 0 0 10px 0; text-align: center; }
.refresh-btn {
  background-color: #34495e;
  border: 1px solid #455a64;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  display: block;
  margin: 0 auto 10px auto;
  font-size: 12px;
}
.refresh-btn:hover { background-color: #415b76; }
.loading-text { text-align: center; color: #bdc3c7; font-size: 14px; }
.score-list { list-style: none; padding: 0; margin: 0; max-height: 150px; overflow-y: auto; }
.score-item { display: flex; justify-content: space-between; padding: 6px 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); font-size: 14px; }
.player-rank { color: #f1c40f; font-weight: bold; }
.player-name { flex-grow: 1; margin-left: 15px; }
.player-score { font-weight: bold; color: #2ecc71; }
</style>

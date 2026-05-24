<template>
  <div class="game-wrapper">
    <!-- Score Board displaying real-time global states from Vuex -->
    <div class="score-board">
      <div>Score: {{ currentScore }}</div>
      <div class="highscore-tag">High Score: {{ personalBest }}</div>
      <div class="difficulty-tag">Level: {{ currentDifficulty }}</div>
    </div>

    <!-- Game Container Layer -->
    <div class="game-container">
      <!-- Player Element -->
      <div 
        class="player" 
        :class="{ 'jump-animation': isJumping }"
        ref="playerRef"
      ></div>

      <!-- Obstacle Element -->
      <div 
        class="obstacle" 
        :style="{ left: obstacleX + 'px' }"
        ref="obstacleRef"
      ></div>

      <!-- Game Over Overlay Screen -->
      <div v-if="gameOver" class="game-over-overlay">
        <h2>Game Over</h2>
        <button @click="resetGame">Restart Game</button>
      </div>
    </div>
    <p class="controls-hint">Press <strong>Spacebar</strong> to Jump & Start Music</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
// Import your fresh database service module
import gameService from '../services/gameServices';

export default {
  name: "JumpGame",
  data() {
    return {
      gameOver: false,
      isJumping: false,
      obstacleX: 600,
      speed: 6,
      animationFrameId: null,
      bgMusic: null,
      isMusicPlaying: false,
      
      jumpSoundSrc: require('@/assets/sound/Jump.mp3'),
      pointSoundSrc: require('@/assets/sound/Point.mp3'),
      bgMusicSrc: require('@/assets/sound/background.mp3')
    };
  },
  computed: {
    ...mapGetters(['currentScore', 'currentDifficulty', 'personalBest'])
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyDown);
    this.startGame();
  },
  unmounted() {
    window.removeEventListener("keydown", this.handleKeyDown);
    cancelAnimationFrame(this.animationFrameId);
    this.stopMusic();
  },
  methods: {
    ...mapActions(['addScore', 'changeDifficulty', 'resetGameStore']),

    startGame() {
      this.gameLoop();
    },
    handleKeyDown(event) {
      if (event.code === "Space") {
        event.preventDefault(); 
        if (this.gameOver) return;
        if (!this.isMusicPlaying) this.playMusic();
        if (!this.isJumping) this.jump();
      }
    },
    jump() {
      this.isJumping = true;
      this.playSound('jump');
      setTimeout(() => { this.isJumping = false; }, 600);
    },
    gameLoop() {
      if (this.gameOver) return;
      this.obstacleX -= this.speed;
      if (this.obstacleX < -20) {
        this.obstacleX = 600;
        this.incrementScore();
      }
      this.checkCollision();
      if (!this.gameOver) {
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
      }
    },
    checkCollision() {
      const player = this.$refs.playerRef;
      const obstacle = this.$refs.obstacleRef;
      if (!player || !obstacle) return;

      const playerRect = player.getBoundingClientRect();
      const obstacleRect = obstacle.getBoundingClientRect();

      const hasHorizontalOverlap = obstacleRect.left < playerRect.right && obstacleRect.right > playerRect.left;
      const hasVerticalOverlap = obstacleRect.top < playerRect.bottom && obstacleRect.bottom > playerRect.top;

      if (hasHorizontalOverlap && hasVerticalOverlap) {
        this.gameOver = true;
        cancelAnimationFrame(this.animationFrameId);
        this.stopMusic(); 
        
        // API TRIGGER: Prompts user to upload performance values straight to the cloud server
        this.handleGameCompletion();
      }
    },
    async handleGameCompletion() {
      // Small timeout lets the Game Over screen overlay draw before opening the blocking prompt box
      setTimeout(async () => {
        const name = prompt(`💥 Game Over! You scored ${this.currentScore} points. Enter your initials to save to the leaderboard:`);
        if (name) {
          try {
            await gameService.submitHighScore(name, this.currentScore);
            alert("Score successfully synced to database server logs!");
          } catch (e) {
            alert("Network connection error. Score kept locally.");
          }
        }
      }, 100);
    },
    incrementScore() {
      this.addScore();
      this.playSound('score');
      if (this.currentScore % 4 === 0) {
        this.speed += 1.5;
        this.changeDifficulty(this.currentDifficulty + 1);
      }
    },
    playSound(soundName) {
      let targetSrc = soundName === 'jump' ? this.jumpSoundSrc : this.pointSoundSrc;
      if (targetSrc) {
        const audio = new Audio(targetSrc);
        audio.volume = 0.4;
        audio.play().catch(() => {});
      }
    },
    playMusic() {
      this.bgMusic = new Audio(this.bgMusicSrc);
      this.bgMusic.loop = true;
      this.bgMusic.volume = 0.2;
      this.bgMusic.play().then(() => { this.isMusicPlaying = true; }).catch(() => {});
    },
    stopMusic() {
      if (this.bgMusic) {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
        this.isMusicPlaying = false;
      }
    },
    resetGame() {
      this.resetGameStore();
      this.gameOver = false;
      this.isJumping = false;
      this.obstacleX = 600;
      this.speed = 6;
      this.playMusic(); 
      this.startGame();
    }
  }
};
</script>

<style scoped>
.game-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  margin-top: 20px;
}

.score-board {
  display: flex;
  gap: 25px;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.highscore-tag {
  color: #2ecc71;
}

.difficulty-tag {
  color: #e67e22;
}

.game-container {
  position: relative;
  width: 600px;
  height: 200px;
  background-color: #f0f0f0;
  border: 2px solid #333;
  overflow: hidden;
  border-radius: 4px;
}

.player {
  position: absolute;
  bottom: 0;
  left: 50px;
  width: 40px;
  height: 40px;
  background-color: #3498db;
  border-radius: 4px;
}

.jump-animation {
  animation: jumpArc 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes jumpArc {
  0% { bottom: 0; }
  50% { bottom: 110px; }
  100% { bottom: 0; }
}

.obstacle {
  position: absolute;
  bottom: 0;
  width: 20px;
  height: 40px;
  background-color: #e74c3c;
  border-radius: 2px;
}

.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 10;
}

.game-over-overlay h2 {
  margin: 0 0 15px 0;
  font-size: 24px;
  color: #e74c3c;
}

.game-over-overlay button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #2ecc71;
  border: none;
  color: white;
  border-radius: 4px;
  font-weight: bold;
}

.game-over-overlay button:hover {
  background-color: #27ae60;
}

.controls-hint {
  margin-top: 10px;
  color: #666;
}
</style>

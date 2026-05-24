<template>
  <div id="app">
    <div class="arcade-cabinet">
      <JumpGame />
      <Leaderboard />
    </div>
  </div>
</template>

<script>
import JumpGame from "./components/jumpGame.vue";
// FIX: Points directly to the correct components subfolder layout
import Leaderboard from "./components/Leaderboard.vue"; 

export default {
  name: "App",
  components: {
    JumpGame,
    Leaderboard
  }
};
</script>

<style>
body { margin: 0; padding: 0; background-color: #fafafa; }
#app { display: flex; justify-content: center; align-items: center; min-height: 100vh; }
.arcade-cabinet { display: flex; flex-direction: column; align-items: center; }
</style>

import axios from 'axios';

// Public test mock backend API base address
const API_BASE_URL = 'typicode.com';

export default {
  /**
   * Sends the player's name and performance score to the backend server database
   */
  async submitHighScore(playerName, score) {
    try {
      console.log(`[API Request]: Posting high score for ${playerName}...`);
      
      // Simulating a POST request to a mock /posts endpoint acting as /scores
      const response = await axios.post(`${API_BASE_URL}/posts`, {
        name: playerName,
        highScore: score,
        gameMode: 'JumpGame'
      });
      
      console.log('[API Response - Success]:', response.data);
      return response.data;
    } catch (error) {
      console.error('[API Request - Failed]: Unable to save high score:', error);
      throw error;
    }
  },

  /**
   * Retrieves the collective baseline leaderboard data arrays from the cloud
   */
  async fetchHighScores() {
    try {
      console.log('[API Request]: Fetching top leaderboard records...');
      
      // Simulating a GET request to a mock endpoint
      const response = await axios.get(`${API_BASE_URL}/users`);
      
      console.log('[API Response - Success]: Received rankings array.');
      
      // Map mock API data into an arcade leaderboard format
      return response.data.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        // Generate mock stable arcade metrics based on user IDs
        highScore: 100 - (index * 8) 
      }));
    } catch (error) {
      console.error('[API Request - Failed]: Unable to gather leaderboard records:', error);
      return [];
    }
  }
};

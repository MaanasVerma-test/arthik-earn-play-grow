import { supabase } from "./supabase";

export interface Player {
  id: string;
  username: string;
  avatar_url?: string;
  progress: number; // 0 to 100
}

export interface Match {
  id: string;
  player1: Player;
  player2: Player;
  status: 'counting_down' | 'playing' | 'finished';
  startTime: number;
}

// For local testing/demo if Supabase tables are not yet created
const MOCK_BOT: Player = {
  id: 'bot_id',
  username: 'ShadowPlayer_Bot',
  progress: 0
};

export const multiplayerService = {
  /**
   * Joins a matchmaking channel and waits for an opponent.
   * For the prototype, we use Supabase Broadcast (Realtime Channels) 
   * to simulate matchmaking without needing complex backend workers.
   */
  async findMatch(userId: string, username: string, onMatchFound: (match: Match) => void) {
    const channel = supabase.channel('matchmaking', {
        config: {
            broadcast: { self: true }
        }
    });

    // Simulate matchmaking
    console.log("Searching for match...");
    
    // In a real app, we'd write to a 'matchmaking_queue' table here.
    // For this prototype, we'll wait 3 seconds then "find" a bot or another player on the channel.
    setTimeout(() => {
        const matchId = `match_${Math.random().toString(36).substr(2, 9)}`;
        const match: Match = {
            id: matchId,
            player1: { id: userId, username, progress: 0 },
            player2: MOCK_BOT,
            status: 'counting_down',
            startTime: Date.now() + 5000
        };
        onMatchFound(match);
    }, 4000);

    return channel;
  },

  /**
   * Syncs progress to the match channel
   */
  async updateProgress(matchId: string, userId: string, progress: number) {
      const channel = supabase.channel(`match_${matchId}`);
      await channel.send({
          type: 'broadcast',
          event: 'progress',
          payload: { userId, progress }
      });
  }
};

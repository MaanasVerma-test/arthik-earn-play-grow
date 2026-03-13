import { supabase } from "./supabase";

export interface ActivityLog {
  id: string;
  activity_type: string;
  details: string;
  xp_earned: number;
  created_at: string;
}

export const secureService = {
  /**
   * Securely awards XP to a user via a server-side PostgreSQL function (RPC).
   * This is more secure than direct client-side updates.
   */
  awardXP: async (xp: number, activity: string, details: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return null;

      const { data, error } = await supabase.rpc('award_xp_securely', {
        target_user_id: session.session.user.id,
        xp_amount: xp,
        activity_name: activity,
        activity_details: details
      });

      if (error) throw error;
      return data;
    } catch (e) {
      console.error("Secure XP award failed:", e);
      return { success: false, message: "Server communication error." };
    }
  },

  /**
   * Fetches recent activity logs for the current user.
   */
  getRecentActivity: async (limit: number = 5): Promise<ActivityLog[]> => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) return [];

      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Failed to fetch activity logs:", e);
      return [];
    }
  }
};

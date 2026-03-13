-- 1. Create Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL, -- e.g., 'GAME_COMPLETED', 'STOCK_TRADE'
    details TEXT, -- e.g., 'Won 1v1 Match', 'Simulated 10-year Portfolio'
    xp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own logs
CREATE POLICY "Users can view their own activity logs" 
ON public.activity_logs FOR SELECT 
USING (auth.uid() = user_id);

-- 2. Create Leaderboard Snapshots Table (for Seasons)
CREATE TABLE IF NOT EXISTS public.leaderboard_snapshots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    season_name TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    username TEXT,
    xp INTEGER NOT NULL,
    rank INTEGER,
    captured_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Secure XP Awarding Function (RPC)
-- This function runs on the server and ensures XP is awarded safely
CREATE OR REPLACE FUNCTION public.award_xp_securely(
    target_user_id UUID,
    xp_amount INTEGER,
    activity_name TEXT,
    activity_details TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated permissions to update profiles
AS $$
DECLARE
    new_total_xp INTEGER;
BEGIN
    -- 1. Security check: Only allow reasonable XP amounts to prevent abuse (prototype limit: 500 per call)
    IF xp_amount > 500 THEN
        RETURN jsonb_build_object('success', false, 'message', 'XP amount exceeds security limits.');
    END IF;

    -- 2. Update user profile XP
    UPDATE public.profiles
    SET xp = COALESCE(xp, 0) + xp_amount
    WHERE id = target_user_id
    RETURNING xp INTO new_total_xp;

    -- 3. Log the activity
    INSERT INTO public.activity_logs (user_id, activity_type, details, xp_earned)
    VALUES (target_user_id, activity_name, activity_details, xp_amount);

    RETURN jsonb_build_object(
        'success', true, 
        'new_xp', new_total_xp,
        'message', 'XP awarded and activity logged successfully.'
    );
END;
$$;

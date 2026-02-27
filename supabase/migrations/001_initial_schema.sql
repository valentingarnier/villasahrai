-- ============================================
-- SaaS Template — Initial Schema
-- ============================================
-- Run this in Supabase SQL Editor after creating your project.
-- Users are managed by Supabase Auth (auth.users).
-- App tables live in the public schema.

-- Stripe subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(100) NOT NULL,
    stripe_subscription_id VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',  -- ACTIVE, PAST_DUE, CANCELED
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub_id ON subscriptions(stripe_subscription_id);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies (service role bypasses RLS, these are for client-side access)
CREATE POLICY "Users can view own subscription"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================
-- Add more tables below as your app grows.
-- Examples:
--
-- CREATE TABLE IF NOT EXISTS user_profiles (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
--     display_name VARCHAR(100),
--     avatar_url TEXT,
--     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
--     UNIQUE(user_id)
-- );
--
-- CREATE TABLE IF NOT EXISTS api_keys (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
--     provider VARCHAR(20) NOT NULL DEFAULT 'DEFAULT',
--     encrypted_key TEXT NOT NULL,
--     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
--     UNIQUE(user_id, provider)
-- );
-- ============================================

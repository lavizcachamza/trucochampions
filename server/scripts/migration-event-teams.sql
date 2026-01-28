-- Add event_id column to teams table
-- Run this in Supabase SQL Editor

ALTER TABLE teams 
ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id);

-- Add event_id column to rounds table
ALTER TABLE rounds
ADD COLUMN IF NOT EXISTS event_id UUID REFERENCES events(id),
ADD COLUMN IF NOT EXISTS category VARCHAR(20);

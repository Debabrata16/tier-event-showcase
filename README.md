# Tier Event Showcase

A Next.js 15 + Clerk + Supabase powered web app to showcase events filtered by user tier (Free, Silver, Gold, Platinum).





## Tech Stack

Next.js 15 (Turbopack)

Clerk – Auth & user tier metadata

Supabase – Database + RLS

Tailwind CSS – UI Styling
## Getting Started

### 1. Clone the Repo
git clone https://github.com/YOUR_USERNAME/tier-event-showcase.git
cd tier-event-showcase

### 2. Install Dependencies
npm install

### 3. Create .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bWVhc3VyZWQtYnVjay0zMS5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_PR4m0yCJr5aMwl2PdwXepWlf8sXcXRCcsHfLgvnTH7

NEXT_PUBLIC_SUPABASE_URL=https://ofeetehtzxnwebdjkjor.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mZWV0ZWh0enhud2ViZGpram9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwMzA1NjcsImV4cCI6MjA2OTYwNjU2N30.-dSqRjOXwfp9vMt2-34z9YoEqSAKvBoYhYNPJgcqOJ8

## Supabase Setup
### 1. Create Project

Go to supabase.com

New Project → Set DB password and region

### 2. SQL Table Setup

Open SQL Editor and run:

create type tier as enum ('free', 'silver', 'gold', 'platinum');

create table events (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  event_date timestamp,
  image_url text,
  tier tier
);

### 3. Seed Events
insert into events (title, description, event_date, image_url, tier) values
('Free Show 1', 'Open to all', now(), '', 'free'),
('Free Show 2', 'Everyone welcome', now(), '', 'free'),
('Silver Concert', 'Silver tier access', now(), '', 'silver'),
('Silver Workshop', 'Advanced silver session', now(), '', 'silver'),
('Gold Gala', 'Exclusive to gold members', now(), '', 'gold'),
('Gold Lounge', 'Private gold lounge', now(), '', 'gold'),
('Platinum Premiere', 'Top-tier event', now(), '', 'platinum'),
('Platinum Dinner', 'Private dinner event', now(), '', 'platinum');

### 4. RLS Policy
Enable RLS on events table and run:

create policy "tier based access"
on events
for select
using (
  auth.jwt() -> 'publicMetadata' ->> 'tier' in (
    'free', 'silver', 'gold', 'platinum'
  )
);
## Clerk Setup

Go to clerk.com

Create a project

Enable "JWT Template" for Supabase

Add Metadata: tier with default free

Copy API Keys into .env.local
##  Run the Dev Server

npm run Dev

Visit: http://localhost:3000
## Tier Upgrade

Logged-in users can upgrade their tier (Free → Silver → Gold → Platinum) by clicking the Upgrade button on the homepage.
## Deploy to Vercel

Go to vercel.com

Import GitHub repo

Add .env.local variables in Vercel dashboard

Click Deploy
##  Created by

Debabrata Nayak

Mail: debabratanayakofficial1@gmail.com

Mobile: 7319263150

Github link:  https://github.com/Debabrata16/tier-event-showcase
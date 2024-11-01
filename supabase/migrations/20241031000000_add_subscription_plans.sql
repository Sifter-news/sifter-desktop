-- Create subscription plans table if it doesn't exist
create table if not exists "public"."subscription_plans" (
    "id" text primary key,
    "name" text not null,
    "price" decimal,
    "description" text,
    "features" jsonb,
    "created_at" timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default plans
insert into "public"."subscription_plans" ("id", "name", "price", "description", "features")
values
    ('free', 'FREE', 0, 'Basic features for personal use', '["Unlimited public projects", "Basic features", "Email support", "One click deploy"]'),
    ('pro', 'PRO', 19, 'Advanced features for professionals', '["Private projects", "> 10x higher rate limits", "Pay as you go, if daily AI credits run out", "Early access to AI-powered features", "Priority support"]'),
    ('teams', 'TEAMS', null, 'Enterprise features for teams', '["Collaborate on projects", "Connect existing codebases", "Custom rate limits", "Dedicated support"]');

-- Add RLS policies
alter table "public"."subscription_plans" enable row level security;

create policy "Allow public read access"
    on "public"."subscription_plans"
    for select
    to public
    using (true);
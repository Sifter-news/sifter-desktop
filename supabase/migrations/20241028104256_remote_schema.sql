drop policy "Enable delete for investigation owners" on "public"."investigations";

drop policy "Enable insert for authenticated users only" on "public"."investigations";

drop policy "Enable read access for all users" on "public"."investigations";

drop policy "Enable update for investigation owners" on "public"."investigations";

drop policy "Enable delete for report owners" on "public"."reports";

drop policy "Enable insert for authenticated users" on "public"."reports";

drop policy "Enable read access for all users" on "public"."reports";

drop policy "Enable update for report owners" on "public"."reports";

drop index if exists "public"."idx_investigations_owner_id";

drop index if exists "public"."idx_node_coordinates";

drop index if exists "public"."idx_node_investigation_id";

drop index if exists "public"."idx_reports_investigation_id";

alter table "public"."log_node_chain_of_custody" enable row level security;

alter table "public"."log_node_suggestions" enable row level security;

alter table "public"."log_project" enable row level security;

alter table "public"."log_user" enable row level security;

alter table "public"."node_concept" enable row level security;

alter table "public"."node_object" enable row level security;

alter table "public"."node_organization" enable row level security;

alter table "public"."node_person" enable row level security;

alter table "public"."organization" enable row level security;

alter table "public"."organization_subscription" enable row level security;

alter table "public"."profiles" drop column "avatar_url";

alter table "public"."project_access" enable row level security;

alter table "public"."profiles" add constraint "profiles_subscription_plan_id_fkey" FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id) not valid;

alter table "public"."profiles" validate constraint "profiles_subscription_plan_id_fkey";



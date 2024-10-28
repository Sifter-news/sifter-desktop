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

create table "public"."log_node_chain_of_custody" (
    "id" uuid not null default uuid_generate_v4(),
    "node_id" uuid,
    "version_number" integer default 1,
    "change_type" character varying(50),
    "change_description" text,
    "custody_event" boolean default false,
    "file_hash" text,
    "timestamp" timestamp without time zone default CURRENT_TIMESTAMP,
    "performed_by" uuid,
    "source_location" text,
    "recipient_person" uuid,
    "is_physical" boolean default false
);


alter table "public"."log_node_chain_of_custody" enable row level security;

create table "public"."log_node_suggestions" (
    "id" uuid not null default uuid_generate_v4(),
    "node_id" uuid,
    "user_id" uuid,
    "suggestion" text,
    "status" character varying(50),
    "timestamp" timestamp without time zone default CURRENT_TIMESTAMP
);


alter table "public"."log_node_suggestions" enable row level security;

create table "public"."log_project" (
    "id" uuid not null default uuid_generate_v4(),
    "investigation_id" uuid,
    "action_type" character varying(50),
    "performed_by" uuid,
    "timestamp" timestamp without time zone default CURRENT_TIMESTAMP
);


alter table "public"."log_project" enable row level security;

create table "public"."log_user" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "activity_type" character varying(50),
    "description" text,
    "timestamp" timestamp without time zone default CURRENT_TIMESTAMP
);


alter table "public"."log_user" enable row level security;

create table "public"."node_concept" (
    "node_id" uuid not null,
    "definition" text,
    "evolving_meanings" jsonb
);


alter table "public"."node_concept" enable row level security;

create table "public"."node_event" (
    "id" uuid not null default uuid_generate_v4(),
    "event_name" character varying(255),
    "event_type" character varying(50),
    "start_date" timestamp without time zone,
    "end_date" timestamp without time zone,
    "location_id" uuid,
    "description" text,
    "investigation_id" uuid,
    "parent_event_id" uuid,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP
);


create table "public"."node_location" (
    "id" uuid not null default uuid_generate_v4(),
    "name" character varying(255),
    "coordinates" geography(Point,4326),
    "description" text
);


create table "public"."node_object" (
    "node_id" uuid not null,
    "object_type" character varying(50),
    "ownership" jsonb,
    "metadata" jsonb
);


alter table "public"."node_object" enable row level security;

create table "public"."node_organization" (
    "node_id" uuid not null,
    "legal_name" character varying(255),
    "business_number" character varying(100),
    "parent_org" uuid,
    "subsidiary_org" uuid
);


alter table "public"."node_organization" enable row level security;

create table "public"."node_person" (
    "node_id" uuid not null,
    "birth_date" date,
    "death_date" date,
    "gender" character varying(50),
    "aliases" text[],
    "online_usernames" jsonb
);


alter table "public"."node_person" enable row level security;

create table "public"."organization" (
    "id" uuid not null default uuid_generate_v4(),
    "name" character varying(255) not null,
    "description" text,
    "created_by" uuid,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP
);


alter table "public"."organization" enable row level security;

create table "public"."organization_subscription" (
    "id" uuid not null default uuid_generate_v4(),
    "organization_id" uuid,
    "plan_id" uuid,
    "start_date" timestamp without time zone not null,
    "end_date" timestamp without time zone,
    "status" character varying(50),
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP
);


alter table "public"."organization_subscription" enable row level security;

create table "public"."project_access" (
    "investigation_id" uuid not null,
    "user_id" uuid not null,
    "role" character varying(50) not null
);


alter table "public"."project_access" enable row level security;

alter table "public"."investigations" drop column "investigation_focus";

alter table "public"."investigations" drop column "updated_at";

alter table "public"."investigations" disable row level security;

alter table "public"."node" drop column "metadata";

alter table "public"."node" add column "type" character varying(50);

alter table "public"."node" disable row level security;

alter table "public"."profiles" drop column "avatar_url";

alter table "public"."reports" disable row level security;

CREATE UNIQUE INDEX log_node_chain_of_custody_pkey ON public.log_node_chain_of_custody USING btree (id);

CREATE UNIQUE INDEX log_node_suggestions_pkey ON public.log_node_suggestions USING btree (id);

CREATE UNIQUE INDEX log_project_pkey ON public.log_project USING btree (id);

CREATE UNIQUE INDEX log_user_pkey ON public.log_user USING btree (id);

CREATE UNIQUE INDEX node_concept_pkey ON public.node_concept USING btree (node_id);

CREATE UNIQUE INDEX node_event_pkey ON public.node_event USING btree (id);

CREATE UNIQUE INDEX node_location_pkey ON public.node_location USING btree (id);

CREATE UNIQUE INDEX node_object_pkey ON public.node_object USING btree (node_id);

CREATE UNIQUE INDEX node_organization_pkey ON public.node_organization USING btree (node_id);

CREATE UNIQUE INDEX node_person_pkey ON public.node_person USING btree (node_id);

CREATE UNIQUE INDEX organization_pkey ON public.organization USING btree (id);

CREATE UNIQUE INDEX organization_subscription_pkey ON public.organization_subscription USING btree (id);

CREATE UNIQUE INDEX project_access_pkey ON public.project_access USING btree (investigation_id, user_id);

alter table "public"."log_node_chain_of_custody" add constraint "log_node_chain_of_custody_pkey" PRIMARY KEY using index "log_node_chain_of_custody_pkey";

alter table "public"."log_node_suggestions" add constraint "log_node_suggestions_pkey" PRIMARY KEY using index "log_node_suggestions_pkey";

alter table "public"."log_project" add constraint "log_project_pkey" PRIMARY KEY using index "log_project_pkey";

alter table "public"."log_user" add constraint "log_user_pkey" PRIMARY KEY using index "log_user_pkey";

alter table "public"."node_concept" add constraint "node_concept_pkey" PRIMARY KEY using index "node_concept_pkey";

alter table "public"."node_event" add constraint "node_event_pkey" PRIMARY KEY using index "node_event_pkey";

alter table "public"."node_location" add constraint "node_location_pkey" PRIMARY KEY using index "node_location_pkey";

alter table "public"."node_object" add constraint "node_object_pkey" PRIMARY KEY using index "node_object_pkey";

alter table "public"."node_organization" add constraint "node_organization_pkey" PRIMARY KEY using index "node_organization_pkey";

alter table "public"."node_person" add constraint "node_person_pkey" PRIMARY KEY using index "node_person_pkey";

alter table "public"."organization" add constraint "organization_pkey" PRIMARY KEY using index "organization_pkey";

alter table "public"."organization_subscription" add constraint "organization_subscription_pkey" PRIMARY KEY using index "organization_subscription_pkey";

alter table "public"."project_access" add constraint "project_access_pkey" PRIMARY KEY using index "project_access_pkey";

alter table "public"."log_node_chain_of_custody" add constraint "log_node_chain_of_custody_node_id_fkey" FOREIGN KEY (node_id) REFERENCES node(id) not valid;

alter table "public"."log_node_chain_of_custody" validate constraint "log_node_chain_of_custody_node_id_fkey";

alter table "public"."log_node_chain_of_custody" add constraint "log_node_chain_of_custody_performed_by_fkey" FOREIGN KEY (performed_by) REFERENCES profiles(id) not valid;

alter table "public"."log_node_chain_of_custody" validate constraint "log_node_chain_of_custody_performed_by_fkey";

alter table "public"."log_node_chain_of_custody" add constraint "log_node_chain_of_custody_recipient_person_fkey" FOREIGN KEY (recipient_person) REFERENCES node(id) not valid;

alter table "public"."log_node_chain_of_custody" validate constraint "log_node_chain_of_custody_recipient_person_fkey";

alter table "public"."log_node_suggestions" add constraint "log_node_suggestions_node_id_fkey" FOREIGN KEY (node_id) REFERENCES node(id) not valid;

alter table "public"."log_node_suggestions" validate constraint "log_node_suggestions_node_id_fkey";

alter table "public"."log_node_suggestions" add constraint "log_node_suggestions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."log_node_suggestions" validate constraint "log_node_suggestions_user_id_fkey";

alter table "public"."log_project" add constraint "log_project_investigation_id_fkey" FOREIGN KEY (investigation_id) REFERENCES investigations(id) not valid;

alter table "public"."log_project" validate constraint "log_project_investigation_id_fkey";

alter table "public"."log_project" add constraint "log_project_performed_by_fkey" FOREIGN KEY (performed_by) REFERENCES profiles(id) not valid;

alter table "public"."log_project" validate constraint "log_project_performed_by_fkey";

alter table "public"."log_user" add constraint "log_user_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."log_user" validate constraint "log_user_user_id_fkey";

alter table "public"."node_concept" add constraint "node_concept_node_id_fkey" FOREIGN KEY (node_id) REFERENCES node(id) not valid;

alter table "public"."node_concept" validate constraint "node_concept_node_id_fkey";

alter table "public"."node_event" add constraint "node_event_investigation_id_fkey" FOREIGN KEY (investigation_id) REFERENCES investigations(id) not valid;

alter table "public"."node_event" validate constraint "node_event_investigation_id_fkey";

alter table "public"."node_event" add constraint "node_event_location_id_fkey" FOREIGN KEY (location_id) REFERENCES node_location(id) not valid;

alter table "public"."node_event" validate constraint "node_event_location_id_fkey";

alter table "public"."node_event" add constraint "node_event_parent_event_id_fkey" FOREIGN KEY (parent_event_id) REFERENCES node_event(id) ON DELETE SET NULL not valid;

alter table "public"."node_event" validate constraint "node_event_parent_event_id_fkey";

alter table "public"."node_object" add constraint "node_object_node_id_fkey" FOREIGN KEY (node_id) REFERENCES node(id) not valid;

alter table "public"."node_object" validate constraint "node_object_node_id_fkey";

alter table "public"."node_organization" add constraint "node_organization_node_id_fkey" FOREIGN KEY (node_id) REFERENCES node(id) not valid;

alter table "public"."node_organization" validate constraint "node_organization_node_id_fkey";

alter table "public"."node_organization" add constraint "node_organization_parent_org_fkey" FOREIGN KEY (parent_org) REFERENCES node(id) not valid;

alter table "public"."node_organization" validate constraint "node_organization_parent_org_fkey";

alter table "public"."node_organization" add constraint "node_organization_subsidiary_org_fkey" FOREIGN KEY (subsidiary_org) REFERENCES node(id) not valid;

alter table "public"."node_organization" validate constraint "node_organization_subsidiary_org_fkey";

alter table "public"."node_person" add constraint "node_person_node_id_fkey" FOREIGN KEY (node_id) REFERENCES node(id) not valid;

alter table "public"."node_person" validate constraint "node_person_node_id_fkey";

alter table "public"."organization" add constraint "organization_created_by_fkey" FOREIGN KEY (created_by) REFERENCES profiles(id) not valid;

alter table "public"."organization" validate constraint "organization_created_by_fkey";

alter table "public"."organization_subscription" add constraint "organization_subscription_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organization(id) not valid;

alter table "public"."organization_subscription" validate constraint "organization_subscription_organization_id_fkey";

alter table "public"."organization_subscription" add constraint "organization_subscription_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) not valid;

alter table "public"."organization_subscription" validate constraint "organization_subscription_plan_id_fkey";

alter table "public"."profiles" add constraint "profiles_subscription_plan_id_fkey" FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id) not valid;

alter table "public"."profiles" validate constraint "profiles_subscription_plan_id_fkey";

alter table "public"."project_access" add constraint "project_access_investigation_id_fkey" FOREIGN KEY (investigation_id) REFERENCES investigations(id) not valid;

alter table "public"."project_access" validate constraint "project_access_investigation_id_fkey";

alter table "public"."project_access" add constraint "project_access_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."project_access" validate constraint "project_access_user_id_fkey";

grant delete on table "public"."log_node_chain_of_custody" to "anon";

grant insert on table "public"."log_node_chain_of_custody" to "anon";

grant references on table "public"."log_node_chain_of_custody" to "anon";

grant select on table "public"."log_node_chain_of_custody" to "anon";

grant trigger on table "public"."log_node_chain_of_custody" to "anon";

grant truncate on table "public"."log_node_chain_of_custody" to "anon";

grant update on table "public"."log_node_chain_of_custody" to "anon";

grant delete on table "public"."log_node_chain_of_custody" to "authenticated";

grant insert on table "public"."log_node_chain_of_custody" to "authenticated";

grant references on table "public"."log_node_chain_of_custody" to "authenticated";

grant select on table "public"."log_node_chain_of_custody" to "authenticated";

grant trigger on table "public"."log_node_chain_of_custody" to "authenticated";

grant truncate on table "public"."log_node_chain_of_custody" to "authenticated";

grant update on table "public"."log_node_chain_of_custody" to "authenticated";

grant delete on table "public"."log_node_chain_of_custody" to "service_role";

grant insert on table "public"."log_node_chain_of_custody" to "service_role";

grant references on table "public"."log_node_chain_of_custody" to "service_role";

grant select on table "public"."log_node_chain_of_custody" to "service_role";

grant trigger on table "public"."log_node_chain_of_custody" to "service_role";

grant truncate on table "public"."log_node_chain_of_custody" to "service_role";

grant update on table "public"."log_node_chain_of_custody" to "service_role";

grant delete on table "public"."log_node_suggestions" to "anon";

grant insert on table "public"."log_node_suggestions" to "anon";

grant references on table "public"."log_node_suggestions" to "anon";

grant select on table "public"."log_node_suggestions" to "anon";

grant trigger on table "public"."log_node_suggestions" to "anon";

grant truncate on table "public"."log_node_suggestions" to "anon";

grant update on table "public"."log_node_suggestions" to "anon";

grant delete on table "public"."log_node_suggestions" to "authenticated";

grant insert on table "public"."log_node_suggestions" to "authenticated";

grant references on table "public"."log_node_suggestions" to "authenticated";

grant select on table "public"."log_node_suggestions" to "authenticated";

grant trigger on table "public"."log_node_suggestions" to "authenticated";

grant truncate on table "public"."log_node_suggestions" to "authenticated";

grant update on table "public"."log_node_suggestions" to "authenticated";

grant delete on table "public"."log_node_suggestions" to "service_role";

grant insert on table "public"."log_node_suggestions" to "service_role";

grant references on table "public"."log_node_suggestions" to "service_role";

grant select on table "public"."log_node_suggestions" to "service_role";

grant trigger on table "public"."log_node_suggestions" to "service_role";

grant truncate on table "public"."log_node_suggestions" to "service_role";

grant update on table "public"."log_node_suggestions" to "service_role";

grant delete on table "public"."log_project" to "anon";

grant insert on table "public"."log_project" to "anon";

grant references on table "public"."log_project" to "anon";

grant select on table "public"."log_project" to "anon";

grant trigger on table "public"."log_project" to "anon";

grant truncate on table "public"."log_project" to "anon";

grant update on table "public"."log_project" to "anon";

grant delete on table "public"."log_project" to "authenticated";

grant insert on table "public"."log_project" to "authenticated";

grant references on table "public"."log_project" to "authenticated";

grant select on table "public"."log_project" to "authenticated";

grant trigger on table "public"."log_project" to "authenticated";

grant truncate on table "public"."log_project" to "authenticated";

grant update on table "public"."log_project" to "authenticated";

grant delete on table "public"."log_project" to "service_role";

grant insert on table "public"."log_project" to "service_role";

grant references on table "public"."log_project" to "service_role";

grant select on table "public"."log_project" to "service_role";

grant trigger on table "public"."log_project" to "service_role";

grant truncate on table "public"."log_project" to "service_role";

grant update on table "public"."log_project" to "service_role";

grant delete on table "public"."log_user" to "anon";

grant insert on table "public"."log_user" to "anon";

grant references on table "public"."log_user" to "anon";

grant select on table "public"."log_user" to "anon";

grant trigger on table "public"."log_user" to "anon";

grant truncate on table "public"."log_user" to "anon";

grant update on table "public"."log_user" to "anon";

grant delete on table "public"."log_user" to "authenticated";

grant insert on table "public"."log_user" to "authenticated";

grant references on table "public"."log_user" to "authenticated";

grant select on table "public"."log_user" to "authenticated";

grant trigger on table "public"."log_user" to "authenticated";

grant truncate on table "public"."log_user" to "authenticated";

grant update on table "public"."log_user" to "authenticated";

grant delete on table "public"."log_user" to "service_role";

grant insert on table "public"."log_user" to "service_role";

grant references on table "public"."log_user" to "service_role";

grant select on table "public"."log_user" to "service_role";

grant trigger on table "public"."log_user" to "service_role";

grant truncate on table "public"."log_user" to "service_role";

grant update on table "public"."log_user" to "service_role";

grant delete on table "public"."node_concept" to "anon";

grant insert on table "public"."node_concept" to "anon";

grant references on table "public"."node_concept" to "anon";

grant select on table "public"."node_concept" to "anon";

grant trigger on table "public"."node_concept" to "anon";

grant truncate on table "public"."node_concept" to "anon";

grant update on table "public"."node_concept" to "anon";

grant delete on table "public"."node_concept" to "authenticated";

grant insert on table "public"."node_concept" to "authenticated";

grant references on table "public"."node_concept" to "authenticated";

grant select on table "public"."node_concept" to "authenticated";

grant trigger on table "public"."node_concept" to "authenticated";

grant truncate on table "public"."node_concept" to "authenticated";

grant update on table "public"."node_concept" to "authenticated";

grant delete on table "public"."node_concept" to "service_role";

grant insert on table "public"."node_concept" to "service_role";

grant references on table "public"."node_concept" to "service_role";

grant select on table "public"."node_concept" to "service_role";

grant trigger on table "public"."node_concept" to "service_role";

grant truncate on table "public"."node_concept" to "service_role";

grant update on table "public"."node_concept" to "service_role";

grant delete on table "public"."node_event" to "anon";

grant insert on table "public"."node_event" to "anon";

grant references on table "public"."node_event" to "anon";

grant select on table "public"."node_event" to "anon";

grant trigger on table "public"."node_event" to "anon";

grant truncate on table "public"."node_event" to "anon";

grant update on table "public"."node_event" to "anon";

grant delete on table "public"."node_event" to "authenticated";

grant insert on table "public"."node_event" to "authenticated";

grant references on table "public"."node_event" to "authenticated";

grant select on table "public"."node_event" to "authenticated";

grant trigger on table "public"."node_event" to "authenticated";

grant truncate on table "public"."node_event" to "authenticated";

grant update on table "public"."node_event" to "authenticated";

grant delete on table "public"."node_event" to "service_role";

grant insert on table "public"."node_event" to "service_role";

grant references on table "public"."node_event" to "service_role";

grant select on table "public"."node_event" to "service_role";

grant trigger on table "public"."node_event" to "service_role";

grant truncate on table "public"."node_event" to "service_role";

grant update on table "public"."node_event" to "service_role";

grant delete on table "public"."node_location" to "anon";

grant insert on table "public"."node_location" to "anon";

grant references on table "public"."node_location" to "anon";

grant select on table "public"."node_location" to "anon";

grant trigger on table "public"."node_location" to "anon";

grant truncate on table "public"."node_location" to "anon";

grant update on table "public"."node_location" to "anon";

grant delete on table "public"."node_location" to "authenticated";

grant insert on table "public"."node_location" to "authenticated";

grant references on table "public"."node_location" to "authenticated";

grant select on table "public"."node_location" to "authenticated";

grant trigger on table "public"."node_location" to "authenticated";

grant truncate on table "public"."node_location" to "authenticated";

grant update on table "public"."node_location" to "authenticated";

grant delete on table "public"."node_location" to "service_role";

grant insert on table "public"."node_location" to "service_role";

grant references on table "public"."node_location" to "service_role";

grant select on table "public"."node_location" to "service_role";

grant trigger on table "public"."node_location" to "service_role";

grant truncate on table "public"."node_location" to "service_role";

grant update on table "public"."node_location" to "service_role";

grant delete on table "public"."node_object" to "anon";

grant insert on table "public"."node_object" to "anon";

grant references on table "public"."node_object" to "anon";

grant select on table "public"."node_object" to "anon";

grant trigger on table "public"."node_object" to "anon";

grant truncate on table "public"."node_object" to "anon";

grant update on table "public"."node_object" to "anon";

grant delete on table "public"."node_object" to "authenticated";

grant insert on table "public"."node_object" to "authenticated";

grant references on table "public"."node_object" to "authenticated";

grant select on table "public"."node_object" to "authenticated";

grant trigger on table "public"."node_object" to "authenticated";

grant truncate on table "public"."node_object" to "authenticated";

grant update on table "public"."node_object" to "authenticated";

grant delete on table "public"."node_object" to "service_role";

grant insert on table "public"."node_object" to "service_role";

grant references on table "public"."node_object" to "service_role";

grant select on table "public"."node_object" to "service_role";

grant trigger on table "public"."node_object" to "service_role";

grant truncate on table "public"."node_object" to "service_role";

grant update on table "public"."node_object" to "service_role";

grant delete on table "public"."node_organization" to "anon";

grant insert on table "public"."node_organization" to "anon";

grant references on table "public"."node_organization" to "anon";

grant select on table "public"."node_organization" to "anon";

grant trigger on table "public"."node_organization" to "anon";

grant truncate on table "public"."node_organization" to "anon";

grant update on table "public"."node_organization" to "anon";

grant delete on table "public"."node_organization" to "authenticated";

grant insert on table "public"."node_organization" to "authenticated";

grant references on table "public"."node_organization" to "authenticated";

grant select on table "public"."node_organization" to "authenticated";

grant trigger on table "public"."node_organization" to "authenticated";

grant truncate on table "public"."node_organization" to "authenticated";

grant update on table "public"."node_organization" to "authenticated";

grant delete on table "public"."node_organization" to "service_role";

grant insert on table "public"."node_organization" to "service_role";

grant references on table "public"."node_organization" to "service_role";

grant select on table "public"."node_organization" to "service_role";

grant trigger on table "public"."node_organization" to "service_role";

grant truncate on table "public"."node_organization" to "service_role";

grant update on table "public"."node_organization" to "service_role";

grant delete on table "public"."node_person" to "anon";

grant insert on table "public"."node_person" to "anon";

grant references on table "public"."node_person" to "anon";

grant select on table "public"."node_person" to "anon";

grant trigger on table "public"."node_person" to "anon";

grant truncate on table "public"."node_person" to "anon";

grant update on table "public"."node_person" to "anon";

grant delete on table "public"."node_person" to "authenticated";

grant insert on table "public"."node_person" to "authenticated";

grant references on table "public"."node_person" to "authenticated";

grant select on table "public"."node_person" to "authenticated";

grant trigger on table "public"."node_person" to "authenticated";

grant truncate on table "public"."node_person" to "authenticated";

grant update on table "public"."node_person" to "authenticated";

grant delete on table "public"."node_person" to "service_role";

grant insert on table "public"."node_person" to "service_role";

grant references on table "public"."node_person" to "service_role";

grant select on table "public"."node_person" to "service_role";

grant trigger on table "public"."node_person" to "service_role";

grant truncate on table "public"."node_person" to "service_role";

grant update on table "public"."node_person" to "service_role";

grant delete on table "public"."organization" to "anon";

grant insert on table "public"."organization" to "anon";

grant references on table "public"."organization" to "anon";

grant select on table "public"."organization" to "anon";

grant trigger on table "public"."organization" to "anon";

grant truncate on table "public"."organization" to "anon";

grant update on table "public"."organization" to "anon";

grant delete on table "public"."organization" to "authenticated";

grant insert on table "public"."organization" to "authenticated";

grant references on table "public"."organization" to "authenticated";

grant select on table "public"."organization" to "authenticated";

grant trigger on table "public"."organization" to "authenticated";

grant truncate on table "public"."organization" to "authenticated";

grant update on table "public"."organization" to "authenticated";

grant delete on table "public"."organization" to "service_role";

grant insert on table "public"."organization" to "service_role";

grant references on table "public"."organization" to "service_role";

grant select on table "public"."organization" to "service_role";

grant trigger on table "public"."organization" to "service_role";

grant truncate on table "public"."organization" to "service_role";

grant update on table "public"."organization" to "service_role";

grant delete on table "public"."organization_subscription" to "anon";

grant insert on table "public"."organization_subscription" to "anon";

grant references on table "public"."organization_subscription" to "anon";

grant select on table "public"."organization_subscription" to "anon";

grant trigger on table "public"."organization_subscription" to "anon";

grant truncate on table "public"."organization_subscription" to "anon";

grant update on table "public"."organization_subscription" to "anon";

grant delete on table "public"."organization_subscription" to "authenticated";

grant insert on table "public"."organization_subscription" to "authenticated";

grant references on table "public"."organization_subscription" to "authenticated";

grant select on table "public"."organization_subscription" to "authenticated";

grant trigger on table "public"."organization_subscription" to "authenticated";

grant truncate on table "public"."organization_subscription" to "authenticated";

grant update on table "public"."organization_subscription" to "authenticated";

grant delete on table "public"."organization_subscription" to "service_role";

grant insert on table "public"."organization_subscription" to "service_role";

grant references on table "public"."organization_subscription" to "service_role";

grant select on table "public"."organization_subscription" to "service_role";

grant trigger on table "public"."organization_subscription" to "service_role";

grant truncate on table "public"."organization_subscription" to "service_role";

grant update on table "public"."organization_subscription" to "service_role";

grant delete on table "public"."project_access" to "anon";

grant insert on table "public"."project_access" to "anon";

grant references on table "public"."project_access" to "anon";

grant select on table "public"."project_access" to "anon";

grant trigger on table "public"."project_access" to "anon";

grant truncate on table "public"."project_access" to "anon";

grant update on table "public"."project_access" to "anon";

grant delete on table "public"."project_access" to "authenticated";

grant insert on table "public"."project_access" to "authenticated";

grant references on table "public"."project_access" to "authenticated";

grant select on table "public"."project_access" to "authenticated";

grant trigger on table "public"."project_access" to "authenticated";

grant truncate on table "public"."project_access" to "authenticated";

grant update on table "public"."project_access" to "authenticated";

grant delete on table "public"."project_access" to "service_role";

grant insert on table "public"."project_access" to "service_role";

grant references on table "public"."project_access" to "service_role";

grant select on table "public"."project_access" to "service_role";

grant trigger on table "public"."project_access" to "service_role";

grant truncate on table "public"."project_access" to "service_role";

grant update on table "public"."project_access" to "service_role";



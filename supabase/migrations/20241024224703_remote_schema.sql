revoke delete on table "public"."log_investigation" from "anon";

revoke insert on table "public"."log_investigation" from "anon";

revoke references on table "public"."log_investigation" from "anon";

revoke select on table "public"."log_investigation" from "anon";

revoke trigger on table "public"."log_investigation" from "anon";

revoke truncate on table "public"."log_investigation" from "anon";

revoke update on table "public"."log_investigation" from "anon";

revoke delete on table "public"."log_investigation" from "authenticated";

revoke insert on table "public"."log_investigation" from "authenticated";

revoke references on table "public"."log_investigation" from "authenticated";

revoke select on table "public"."log_investigation" from "authenticated";

revoke trigger on table "public"."log_investigation" from "authenticated";

revoke truncate on table "public"."log_investigation" from "authenticated";

revoke update on table "public"."log_investigation" from "authenticated";

revoke delete on table "public"."log_investigation" from "service_role";

revoke insert on table "public"."log_investigation" from "service_role";

revoke references on table "public"."log_investigation" from "service_role";

revoke select on table "public"."log_investigation" from "service_role";

revoke trigger on table "public"."log_investigation" from "service_role";

revoke truncate on table "public"."log_investigation" from "service_role";

revoke update on table "public"."log_investigation" from "service_role";

alter table "public"."log_investigation" drop constraint "log_investigation_investigation_id_fkey";

alter table "public"."log_investigation" drop constraint "log_investigation_performed_by_fkey";

alter table "public"."log_investigation" drop constraint "log_investigation_pkey";

drop index if exists "public"."log_investigation_pkey";

drop table "public"."log_investigation";

create table "public"."log_project" (
    "id" uuid not null default uuid_generate_v4(),
    "investigation_id" uuid,
    "action_type" character varying(50),
    "performed_by" uuid,
    "timestamp" timestamp without time zone default CURRENT_TIMESTAMP
);


alter table "public"."log_project" enable row level security;

CREATE UNIQUE INDEX log_project_pkey ON public.log_project USING btree (id);

alter table "public"."log_project" add constraint "log_project_pkey" PRIMARY KEY using index "log_project_pkey";

alter table "public"."log_project" add constraint "log_project_investigation_id_fkey" FOREIGN KEY (investigation_id) REFERENCES investigations(id) not valid;

alter table "public"."log_project" validate constraint "log_project_investigation_id_fkey";

alter table "public"."log_project" add constraint "log_project_performed_by_fkey" FOREIGN KEY (performed_by) REFERENCES profiles(id) not valid;

alter table "public"."log_project" validate constraint "log_project_performed_by_fkey";

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



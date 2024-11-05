-- Grant permissions to tables
GRANT ALL ON TABLE "public"."log_node_chain_of_custody" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."log_node_suggestions" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."log_project" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."log_user" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."node_concept" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."node_event" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."node_location" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."node_object" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."node_organization" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."node_person" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."organization" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."organization_subscription" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."project_access" TO "anon", "authenticated", "service_role";
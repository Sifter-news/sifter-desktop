-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Load seed files in order
\ir seed/01_plans.sql;
\ir seed/02_users.sql;
\ir seed/03_investigations.sql;
\ir seed/04_reports.sql;
\ir seed/05_nodes.sql;
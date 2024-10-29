create table if not exists public.connections (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    source_id uuid references public.node(id) on delete cascade,
    target_id uuid references public.node(id) on delete cascade,
    source_point text,
    target_point text
);

create index if not exists connections_source_id_idx on public.connections(source_id);
create index if not exists connections_target_id_idx on public.connections(target_id);
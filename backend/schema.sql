create table if not exists trips (
  id bigint generated always as identity primary key,
  destination text not null,
  days int not null,
  preferences jsonb,
  itinerary jsonb not null,
  created_at timestamptz default now()
);
-- Demo project: backend is the only client, so RLS is off.
alter table trips disable row level security;

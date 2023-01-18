set -e
psql -U postgres postgres << EOSQL

--
-- function
--
create or replace function increment_version()
  returns trigger
as
\$body\$
begin
  new.version := new.version + 1;
  return new;
end;
\$body\$
language plpgsql;

create or replace function update_updated_at_column()
RETURNS TRIGGER AS \$\$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
\$\$ language 'plpgsql';

--
-- member
--
CREATE TABLE members (
  id          SERIAL,
  user_name   text PRIMARY KEY,
  user_pass   text not null,
  user_host   text, /* host:port/path or 111.222.333.444:post/path */
  email       text,
  active      boolean default false,
  created_at  timestamp not null default current_timestamp,
  updated_at  timestamp not null default current_timestamp,
  version integer not null default 0
);

create trigger version_trigger_members
  before update on members
  for each row execute procedure increment_version();

create trigger update_updated_at_members
  before update on members
  for each row execute procedure update_updated_at_column();

--
-- session
--
CREATE TABLE sessions (
  id          SERIAL,
  token       text PRIMARY KEY,
  user_name   text not null,
  created_at  timestamp not null default current_timestamp,
  updated_at  timestamp not null default current_timestamp,
  version     integer not null default 0
);

create trigger version_trigger_sessions
  before update on sessions
  for each row execute procedure increment_version();

create trigger update_updated_at_sessions
  before update on sessions
  for each row execute procedure update_updated_at_column();

--
-- command
--
CREATE TABLE commands(
  id          SERIAL,
  user_name   text PRIMARY KEY,
  type        text not null,
  command     text not null,
  memo        text,
  created_at  timestamp not null default current_timestamp,
  updated_at  timestamp not null default current_timestamp,
  version     integer not null default 0
);

create trigger version_trigger_commands
  before update on commands
  for each row execute procedure increment_version();

create trigger update_updated_at_commands
  before update on commands
  for each row execute procedure update_updated_at_column();

--
-- token
--
CREATE TABLE authentication_codes (
  id          SERIAL,
  user_name   text,
  pass        text, /* ランダム数値 6桁 */
  count       integer,
  created_at  timestamp not null default current_timestamp
);

EOSQL
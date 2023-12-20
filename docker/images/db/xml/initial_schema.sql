CREATE TABLE public.imported_documents (
	id              serial PRIMARY KEY,
	file_name       VARCHAR(250) UNIQUE NOT NULL,
	xml             XML NOT NULL,
	created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_on      TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE public.converted_documents (
    id              serial PRIMARY KEY,
    src             VARCHAR(250) UNIQUE NOT NULL,
    file_size       BIGINT NOT NULL,
    dst             VARCHAR(250) UNIQUE NOT NULL,
	checksum 	  VARCHAR(250) UNIQUE NOT NULL,
	created_on      TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_on      TIMESTAMP NOT NULL DEFAULT NOW()
);

create or replace function public.notify_insert_tr()
    returns trigger as $$
begin
    perform pg_notify('watch_channel', new.xml::text);
    return new;
end;
$$ language plpgsql;

create or replace trigger insert_tr
    after insert on public.imported_documents
    for each row execute procedure public.notify_insert_tr();
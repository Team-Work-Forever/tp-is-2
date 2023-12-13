CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS POSTGIS;
CREATE EXTENSION IF NOT EXISTS POSTGIS_TOPOLOGY;

CREATE TABLE public.country (
    id uuid DEFAULT uuid_generate_v4(),
    name varchar(25) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP DEFAULT NULL,
    primary key (id)
);

CREATE TABLE public.region (
    id uuid DEFAULT uuid_generate_v4(),
    name varchar(25) NOT NULL UNIQUE,
    province varchar(50) NOT NULL UNIQUE,
    coordinates GEOMETRY(Point, 4326),
    country_id uuid NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP DEFAULT NULL,
    primary key (id),
     constraint country_id_fk
        foreign key (country_id)
            references country (id)
);

CREATE TABLE public.taster (
    id uuid DEFAULT uuid_generate_v4(),
    name varchar(25) NOT NULL UNIQUE,
    twitter_handle varchar(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP DEFAULT NULL,
    primary key (id)
);

CREATE TABLE public.wine (
    id uuid DEFAULT uuid_generate_v4(),
    price float NOT NULL,
    designation varchar(100) NOT NULL,
    variety varchar(50) NOT NULL,
    winery varchar(50) NOT NULL,
    region_id uuid NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP DEFAULT NULL,
    primary key (id),
    constraint region_id_fk
        foreign key (region_id)
            references region (id)
);

CREATE TABLE public.review (
    id uuid DEFAULT uuid_generate_v4(),
    points int NOT NULL,
    description varchar(100) NOT NULL,
    taster_id uuid NOT NULL,
    wine_id uuid NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    deleted_at TIMESTAMP DEFAULT NULL,
    primary key (id),
     constraint taster_id_fk
        foreign key (taster_id)
            references taster (id),
     constraint wine_id_fk2
        foreign key (wine_id)
            references wine (id)
);
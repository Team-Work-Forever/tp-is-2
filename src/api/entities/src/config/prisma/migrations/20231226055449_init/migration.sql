-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis" WITH VERSION "3.4.1";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "public";

-- CreateTable
CREATE TABLE "country" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v5(uuid_ns_url(), 'country'::text),
    "name" VARCHAR(25) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "region" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v5(uuid_ns_url(), 'region'::text),
    "name" VARCHAR(25) NOT NULL,
    "province" VARCHAR(50) NOT NULL,
    "coordinates" geography(Point, 4326) NOT NULL,
    "country_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v5(uuid_ns_url(), 'review'::text),
    "points" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "taster_id" UUID NOT NULL,
    "wine_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taster" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v5(uuid_ns_url(), 'taster'::text),
    "name" VARCHAR(25) NOT NULL,
    "twitter_handle" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "taster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wine" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v5(uuid_ns_url(), 'wine'::text),
    "price" DOUBLE PRECISION NOT NULL,
    "designation" TEXT NOT NULL,
    "variety" VARCHAR(50) NOT NULL,
    "winery" VARCHAR(50) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "region_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "wine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "country_name_key" ON "country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "region_name_key" ON "region"("name");

-- CreateIndex
CREATE UNIQUE INDEX "taster_name_key" ON "taster"("name");

-- CreateIndex
CREATE UNIQUE INDEX "taster_twitter_handle_key" ON "taster"("twitter_handle");

-- AddForeignKey
ALTER TABLE "region" ADD CONSTRAINT "country_id_fk" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "taster_id_fk" FOREIGN KEY ("taster_id") REFERENCES "taster"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "wine_id_fk2" FOREIGN KEY ("wine_id") REFERENCES "wine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wine" ADD CONSTRAINT "region_id_fk" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

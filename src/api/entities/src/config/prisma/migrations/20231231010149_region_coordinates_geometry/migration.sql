/*
  Warnings:

  - You are about to alter the column `name` on the `country` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(25)`.

*/
-- AlterTable
ALTER TABLE "country" ALTER COLUMN "id" SET DEFAULT uuid_generate_v5(uuid_generate_v4(), 'country'::text),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(25);

-- AlterTable
ALTER TABLE "region" ALTER COLUMN "id" SET DEFAULT uuid_generate_v5(uuid_generate_v4(), 'region'::text),
ALTER COLUMN "coordinates" DROP NOT NULL;

-- AlterTable
ALTER TABLE "review" ALTER COLUMN "id" SET DEFAULT uuid_generate_v5(uuid_generate_v4(), 'review'::text);

-- AlterTable
ALTER TABLE "taster" ALTER COLUMN "id" SET DEFAULT uuid_generate_v5(uuid_generate_v4(), 'taster'::text);

-- AlterTable
ALTER TABLE "wine" ALTER COLUMN "id" SET DEFAULT uuid_generate_v5(uuid_generate_v4(), 'wine'::text);

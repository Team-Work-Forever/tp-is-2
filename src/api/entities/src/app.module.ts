import { Module } from "@nestjs/common";
import { CountryController } from "./controllers/country.controller";
import { CountryService } from "./services/country.service";
import { PrismaService } from "./config/prisma/prisma.service";
import { TasterService } from "./services/taster.service";
import { TasterController } from "./controllers/taster.controller";
import { WineController } from "./controllers/wine.controller";
import { WineService } from "./services/wine.service";
import { ReviewController } from "./controllers/review.controller";
import { ReviewService } from "./services/review.service";
import { RegionController } from "./controllers/region.controller";
import { RegionService } from "./services/region.service";

@Module({
  controllers: [
    CountryController,
    TasterController,
    WineController,
    ReviewController,
    RegionController
  ],
  providers: [
    TasterService,
    PrismaService,
    CountryService,
    WineService,
    ReviewService,
    RegionService
  ],
})
export class AppModule { }

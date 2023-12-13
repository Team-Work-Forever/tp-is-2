import { Prisma } from "@prisma/client";
import { ReviewDto } from "src/contracts/dtos/review.dto";

export type ReviewOptions = Prisma.reviewGetPayload<{
    include: {
        taster: true;
        wine: true;
    }
}>;

export function mapReviewToDto(review: ReviewOptions): ReviewDto {
    return {
        id: review.id,
        points: review.points,
        description: review.description,
        twitterHandle: review.taster.twitter_handle,
        wineId: review.wine.id,
        createdAt: review.created_at,
        updatedAt: review.updated_at,
        deletedAt: review.deleted_at,
    };
}
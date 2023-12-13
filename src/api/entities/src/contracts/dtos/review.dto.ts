export interface ReviewDto {
    id: string;
    points: number;
    description: string;
    twitterHandle: string;
    wineId: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

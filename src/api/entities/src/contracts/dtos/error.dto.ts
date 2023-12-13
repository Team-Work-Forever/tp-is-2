export interface ErrorDto {
    traceId: string;
    message: string;
    errors: { reason: string, path: string }[];
    statusCode: number;
    path: string;
}
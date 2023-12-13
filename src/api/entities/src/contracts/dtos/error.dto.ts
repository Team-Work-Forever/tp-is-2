export interface ErrorDto {
    traceId: string;
    message: string;
    statusCode: number;
    path: string;
}
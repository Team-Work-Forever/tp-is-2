import { HttpException, HttpStatus } from "@nestjs/common";

export class ConflitError extends HttpException {
    constructor(
        message: string,
    ) {
        super(message, HttpStatus.CONFLICT);
    }
}
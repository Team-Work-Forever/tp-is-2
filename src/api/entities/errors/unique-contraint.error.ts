import { ConflitError } from "./confilt.error";

export class UniqueConstraintError extends ConflitError {
    constructor(message: string) {
        super(message);
    }
}
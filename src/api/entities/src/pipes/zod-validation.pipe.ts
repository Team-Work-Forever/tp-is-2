import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodObject } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private readonly schema: ZodObject<any>) { }

    transform(value: any, _: ArgumentMetadata) {
        return this.schema.parse(value);
    }
}

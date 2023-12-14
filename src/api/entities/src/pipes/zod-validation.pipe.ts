import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodAny, ZodEffects, ZodObject } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private readonly schema: ZodObject<any> | ZodEffects<any>) { }

    transform(value: any, _: ArgumentMetadata) {
        return this.schema.parse(value);
    }
}

import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ZodAny, ZodArray, ZodEffects, ZodObject } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private readonly schema: ZodObject<any> | ZodEffects<any> | ZodArray<any>) { }

    transform(value: any, _: ArgumentMetadata) {
        return this.schema.parse(value);
    }
}

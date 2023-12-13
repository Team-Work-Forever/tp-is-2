import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { uuidValidator } from 'src/validation/uuid.validator';
import { z } from 'zod';

@Injectable()
export class UuidPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    return z.object({ id: uuidValidator(metadata.data) }).parse({ id: value });
  }
}

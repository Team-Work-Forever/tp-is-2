import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ErrorDto } from 'src/contracts/dtos/error.dto';
import { ZodError } from 'zod';

@Catch()
export class ZodExceptionFilter<T extends ZodError> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 400;

    response.status(status).json({
      message: "Validation failed",
      errors: this.parseMessageErrors(exception),
      statusCode: status,
      path: ctx.getRequest().url,
    } as ErrorDto);
  }

  private parseMessageErrors(errors: ZodError<any>): { reason: string; path: string }[] {
    return errors.issues.map((issue) => {
      return {
        reason: issue.message,
        path: issue.path[0] as string,
      };
    });
  }
}

import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ErrorDto } from 'src/contracts/dtos/error.dto';

@Catch(HttpException)
export class ConflitExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(exception.getStatus()).json({
      message: exception.message,
      statusCode: exception.getStatus(),
      path: ctx.getRequest().url,
    } as ErrorDto);
  }
}

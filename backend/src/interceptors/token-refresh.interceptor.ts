import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TokenRefreshInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const newToken = response.locals?.newToken;

        if (newToken) {
          response.setHeader('new-access-token', newToken);

          const responseData = typeof data === 'object' ? data : { data };
          return responseData;
        }

        return data;
      }),
    );
  }
}

import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
    BadRequestException,
} from "@nestjs/common";
import {
    PrismaClientKnownRequestError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((err) =>
                throwError(() => {
                    if (err instanceof BadRequestException) {
                        return new HttpException(err, HttpStatus.BAD_REQUEST);
                    }

                    if (err instanceof PrismaClientKnownRequestError) {
                        if (err.code === "P2002") {
                            const field = err.meta?.target;
                            return new HttpException(
                                `Unique constraint failed on the field: ${field}`,
                                HttpStatus.BAD_REQUEST
                            );
                        }

                        return new HttpException(err.message, HttpStatus.BAD_REQUEST);
                    }

                    if (err instanceof PrismaClientUnknownRequestError) {
                        return new HttpException(
                            `Unknown error: ${err.message}`,
                            HttpStatus.BAD_REQUEST
                        );
                    }

                    if (err instanceof PrismaClientValidationError) {
                        return new HttpException(
                            `Validation error: ${err.message.split("\n").at(-1)}`,
                            HttpStatus.BAD_REQUEST
                        );
                    }

                    return new HttpException(
                        err.message,
                        HttpStatus.INTERNAL_SERVER_ERROR
                    );
                })
            )
        );
    }
}

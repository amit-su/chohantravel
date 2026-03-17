import { HttpInterceptorFn } from '@angular/common/http';
import environment from '../environments/environments';

export const appVersionInterceptor: HttpInterceptorFn = (req, next) => {
    const clonedRequest = req.clone({
        setHeaders: {
            'x-app-version': environment.appVersion
        }
    });

    return next(clonedRequest);
};

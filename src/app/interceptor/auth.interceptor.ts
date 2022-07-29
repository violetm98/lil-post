import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import Config from '../../config.json';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  refresh: boolean = false;
  exclude_url = Config.upload_url;
  private access_token: any;

  constructor(private http: HttpClient, private injector: Injector) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let userService = this.injector.get(UserService);
    if (req.url === this.exclude_url) {
      return next.handle(req);
    }

    const cloned = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${userService.accessToken}`
      ),
    });

    return next.handle(cloned).pipe(
      catchError((err: HttpErrorResponse) => {
        this.refresh = false;

        if (err.status === 401 && !this.refresh) {
          this.refresh = true;

          return this.http
            .get('http://localhost:5000/user/refresh', {
              withCredentials: true,
            })
            .pipe(
              switchMap((res: any) => {
                //console.log('new access token', res);

                if (!res.token) {
                  userService.logoutUser();
                  return throwError(() => err);
                }

                this.refresh = false;
                this.access_token = res.token;
                localStorage.setItem('token', res.token);
                return next.handle(
                  req.clone({
                    headers: req.headers.set(
                      'Authorization',
                      'Bearer ' + res.token
                    ),
                  })
                );
              })
            );
        }
        this.refresh = false;
        return throwError(() => err);
      })
    );
  }
}

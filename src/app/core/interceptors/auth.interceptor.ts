import { AuthService } from './../services/auth.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
  })
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}
intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        
        const token = this.authService.currentUser?.token;
        
        const isInclude = this.isOnTheWhiteList(request.url, environment.endpoints.handle_error_blackList);
        if(isInclude){
            return next.handle(request);
        }
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (token && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        }
        return next.handle(request);
    }


    isOnTheWhiteList(url:string, paths: string[]):boolean{
    
        let isInclude:boolean = false;
        paths.forEach((path:string)=>{
          if(url.endsWith(path)){
            isInclude = true;
          }
        });
        return isInclude;
    }
    // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //     const token = this.authService.currentUser?.token;
    //     const isApiUrl = request.url.startsWith(environment.apiUrl);
    //     if (token && isApiUrl) {
    //         request = request.clone({
    //             setHeaders: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });
    //     }
    //     return next.handle(request);
    // }
}

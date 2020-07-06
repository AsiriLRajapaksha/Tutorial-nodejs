import { 
    HttpInterceptor, 
    HttpRequest, 
    HttpHandler 
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(private authService: AuthService){}

    intercept(request:HttpRequest<any> , next:HttpHandler ){
        const token = this.authService.getToken();
        const authRequest =request.clone({
            headers: request.headers.set("Authorization" , "Bearer " + token) 
            // .set -> set extra header "(Authorization)" to the header and value is the token
        });
        return next.handle(authRequest);
    }
} 

 // This is the way angular manage out going requst , out going request mean http request that sent to the backend from frontend.
 // Interceptor is the feture offered by httpCliend.
 // Using this interceptor every out going request will recieve that token,( it is run on any out-going request
 //  to attach our token).
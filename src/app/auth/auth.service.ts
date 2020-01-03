import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';

@Injectable({providedIn:"root"})
export class AuthService{

    constructor(private http: HttpClient){}
    private token:string;
    private authStatusListner = new Subject<boolean>();

    getToken(){
        return this.token;
    }

    getAuthStatusListner(){
        return this.authStatusListner.asObservable();
    }

    createUser(email:string , password:string){
        const authData : AuthData = {
            email: email,
            password: password
        };
        this.http.post("http://localhost:3000/api/user/signup" , authData)
            .subscribe(response => {
                console.log(response);
            });
    }
    login(email:string , password:string){
        const authData : AuthData = { email: email , password: password};
        this.http.post<{token:string}>("http://localhost:3000/api/user/login" , authData)
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                this.authStatusListner.next(true);
            });
    }
}
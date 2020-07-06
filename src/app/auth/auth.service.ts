import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({providedIn:"root"})
export class AuthService{
    private token:string;
    private isAuthonticated = false;
    private userId: string;
    private authStatusListner = new Subject<boolean>();
    private tokenTime:any;

    constructor(private http: HttpClient , private router:Router){}

    getToken(){
        return this.token;
    }

    getUserId(){
        return this.userId;
    }

    getIsAuth(){
        return this.isAuthonticated;
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
                this.router.navigate(["/"]);
            }, error => {
                this.authStatusListner.next(false);
            });
    }
    login(email:string , password:string){
        const authData : AuthData = { email: email , password: password};
        this.http.post<{token:string, expiresIn:number, userId:string}>("http://localhost:3000/api/user/login" , authData)
            .subscribe(response => {
                const token = response.token;
                this.token = token;
                console.log(token);
                if(token){
                    const expireInDuration = response.expiresIn;
                    this.userId = response.userId;
                    this.isAuthonticated = true;
                    this.setAuthTimer(expireInDuration);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expireInDuration * 1000 );
                    this.saveAuthData(token , expirationDate, this.userId);
                    this.authStatusListner.next(true);
                    this.router.navigate(["/"]);
                }
            }, error => {
                this.authStatusListner.next(false)
            });
    }

    autoAuthUser(){
        const authInformation = this.getAuthData();
        if(!authInformation){
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        console.log(expiresIn);
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.userId = authInformation.userId;
            this.isAuthonticated = true;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListner.next(true);
        }
    }

    setAuthTimer(duration : number){
        this.tokenTime = setTimeout(()=>{
            this.logout();
        },duration * 1000);
    }

    logout(){
        this.token = null;
        this.isAuthonticated = false;
        this.authStatusListner.next(false);
        this.userId = null;
        clearTimeout(this.tokenTime);
        this.clearAuthData();
        this.router.navigate(["/"]);
    }

    private saveAuthData(token:string, expirationDate:Date, userId:string){
        localStorage.setItem("token",token);
        localStorage.setItem("expiration",expirationDate.toISOString());
        localStorage.setItem("userId",userId);
    }

    private clearAuthData(){
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");
    }

    private getAuthData(){
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");
        if(!token || !expirationDate){
            return ;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        };
    }
}
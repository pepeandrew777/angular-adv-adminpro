import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable,of } from 'rxjs';
import { tap,map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
//import { HttpClient } from '@angular/common/http';
//import { HttpClient } from '@angular/common/http';

 

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
   constructor(private http:HttpClient,
               private router:Router,
               private ngZone:NgZone
              ) {    
   }

   googleInit(){

   }
   logout(){
     localStorage.removeItem('token');
     this.router.navigateByUrl('/login');
   }
   validarToken():Observable<boolean>{
     const token = localStorage.getItem('token')  || '';

    return this.http.get(`${base_url}/login/renew`,{
                           headers:{
                           'x-token': token
                           }
                          }).pipe(
                           tap( (resp:any)=>{
                            localStorage.setItem('token',resp.token);
                           }),
                           map(resp=>true),
                           catchError(error=>of(false)) 
                          );
                              
   }
   crearUsuario(formData:RegisterForm){
    //  console.log('Creando usuario');          
      return this.http.post(`${base_url}/usuarios`,formData)
                      .pipe(
                       tap( (resp:any) =>{
                     //console.log(resp);
                       localStorage.setItem('token',resp.token);
                      })
      ); 
   }

   login(formData:LoginForm) {
     console.log('login usuario');          
      return this.http.post(`${base_url}/login`,formData)
                 .pipe(
                   tap( (resp:any) =>{
                     //console.log(resp);
                     localStorage.setItem('token',resp.token);
                   })
                 ); 
   }   
}

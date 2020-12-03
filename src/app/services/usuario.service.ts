import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable,of } from 'rxjs';
import { tap,map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Usuario } from '../models/usuario.model';
//import { HttpClient } from '@angular/common/http';
//import { HttpClient } from '@angular/common/http';

 

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario:Usuario;
   constructor(private http:HttpClient,
               private router:Router,
               private ngZone:NgZone
              ) {    
   }




   googleInit(){

   }
   get token():string {
     return localStorage.getItem('token')  || '';
   }

   get uid():string {
     return this.usuario.uid || '';
   }
   get headers(){
     return {
         headers:{
             'x-token': this.token
         }
     }
   }
   logout(){
     localStorage.removeItem('token');
     this.router.navigateByUrl('/login');
   }
   validarToken():Observable<boolean>{
    // const token = localStorage.getItem('token')  || '';

    return this.http.get(`${base_url}/login/renew`,{
                           headers:{
                           'x-token': this.token
                           }
                          }).pipe(
                           map( (resp:any)=>{                           
                             const { email,google,nombre,role,img = '',uid } =  resp.usuario;
                             this.usuario = new Usuario(nombre,email,'',img,google,role,uid);
                              console.log('test1');
                             //this.usuario = resp.usuario;
                             //this.usuario.imprimirUsuario();
                             localStorage.setItem('token',resp.token);
                              return true;
                           }),
                         
                           catchError(error=>
                            of(false)) 
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
   actualizarPerfil(data:{email:string,nombre:string,role:string}){
    
     data = {
       ...data,
       role:this.usuario.role
     };
    return this.http.put(`${base_url}/usuarios/${this.uid}`,data,this.headers);               
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
   cargarUsuarios(desde:number = 0){
         const url = `${ base_url }/usuarios?desde=${ desde }`;
        return this.http.get<CargarUsuario>(url,this.headers)
                   .pipe(
                   //  delay(5000),
                     map(resp=>{
                        const usuarios = resp.usuarios.map(
                          user => new Usuario(user.nombre,user.email,'',user.img,user.google,user.role,user.uid));
                        //console.log(resp);
                       return {
                         total:resp.total,
                         usuarios
                       };
                     })
                   )
   }
   eliminarUsuario(usuario:Usuario){
     //console.log('eliminando');
     const url = `${ base_url }/usuarios/${ usuario.uid }`;
     return this.http.delete(url,this.headers);
   }
   guardarUsuario(usuario:Usuario){
     console.log('en el servicico'+usuario);
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`,usuario,this.headers);               
   }
}


import { Component,OnInit } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
declare const gapi:any;
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit  {
  public formSubmitted = false;
  public loginForm = this.fb.group({
           email:[localStorage.getItem('email') || '',[Validators.required,Validators.email]],
           password:['',Validators.required],
           remember:[false]
          }); 
  constructor(private router:Router,
              private fb:FormBuilder,
              private usuarioService: UsuarioService) { 
   }  
  ngOnInit(): void {
    //this.renderButton();

    this.iniciarConexionGoogle();
  }
  iniciarConexionGoogle(){
    gapi.load('auth2',function(){
      gapi.auth2.init();
    });

  }

  login(){
    // this.router.navigateByUrl('/');
     console.log(this.loginForm.value);
    this.usuarioService.login(this.loginForm.value)
        .subscribe(resp=>{
            //console.log(resp);
            if(this.loginForm.get('remember').value){
                localStorage.setItem('email',this.loginForm.get('email').value);
            } else {
              localStorage.removeItem('email');
            }
            //Navegar al dashboard
            this.router.navigateByUrl('/');
        },(err)=>{
          Swal.fire('Error',err.error.msg,'error');    
        });
  }
  /*
  onSuccess(googleUser){
    var id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token);
    console.log('Logged in as:'+ googleUser.getBasicProfile().getName());
  }
  onFailure(error){
    console.log(error);
  }
  renderButton(){
    gapi.signin2.render('my-signin2',{
     'scope':'profile email',
     'width':240,
     'height':50,
     'longtitle':true,
     'theme':'dark',
     'onsuccess':this.onSuccess,
     'onfailure':this.onFailure
    });
  }  */
  onSignIn(googleUser) {
    console.log('holas muchachos');
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }
  signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }



}

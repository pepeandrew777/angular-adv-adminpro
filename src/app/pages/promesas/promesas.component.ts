import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

     this.getUsuarios().then(usuarios=>{
       console.log(usuarios);
     });
    //promesa es asincrona
    /*
    const promesa = new Promise((resolve,reject)=>{

      if(false){
        resolve('Hola Mundo');  
      } else {
         reject('algo salio mal');
      }
        
    });
    promesa.then((mensaje)=>{
      console.log(mensaje);
    }).catch( error=>console.log('Error en mi promesa',error)

    );
    console.log('Fin del Init'); */
  }

  getUsuarios(){
          const promesa = new Promise(resolve=>{
            fetch('https://regres.in/api/users/')
            .then( resp=>resp.text())
            //.then( body=>resolve(body.data));
          }); 
          
          return promesa;
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { BusquedasService } from 'src/app/services/busquedas.service';

import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit,OnDestroy {
  public totalUsuarios:number = 0;
  public usuarios:Usuario[] = [];
  public usuariosTemp:Usuario[] = [];
  public imgSubs:Subscription;
  public desde:number = 0;
  public cargando:boolean = true; 
  constructor(private usuarioService:UsuarioService,
           private busquedaService:BusquedasService, private modalImagenService:ModalImagenService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarUsuarios();
   this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img=>{
                   //  console.log(img);
                     this.cargarUsuarios();
               });

  }
  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe(({total,usuarios})=>{
      this.totalUsuarios = total;      
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      
    }); 
  }
  cambiarPagina(valor:number){
    this.desde += valor;
    if(this.desde < 0) {
      this.desde = 0;
    } else if(this.desde >= this.totalUsuarios){
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino:string){
    //console.log(termino);
    if(termino.length === 0){
      return this.usuarios = this.usuariosTemp;
    }
    this.busquedaService.buscar('usuarios',termino)
                        .subscribe( resultados => {
                          this.usuarios = resultados;
                        });
  }
  eliminarUsuario(usuario:Usuario){
    //console.log(usuario);
    if(usuario.uid === this.usuarioService.uid){
      return Swal.fire('Error','No puede borrarse a si mismo','error');
    }
 
    Swal.fire({
      title:'¿Borrar usuario?',
      text:`Esta a punto de borrar a ${usuario.nombre}`,
      icon:'question',
      showCancelButton:true,
      confirmButtonText:'Si,borrarlo'
    }).then( (result) => {      
         if(result.value) {
            this.usuarioService.eliminarUsuario(usuario)
                .subscribe(resp=> { Swal.fire('Usuario borrado',`${usuario.nombre} fue eliminado correctament`,'success')
                   this.cargarUsuarios();
              });       
         }       
    }) 
    
  }
  cambiarRole(usuario:Usuario){

    console.log(usuario);
    
     this.usuarioService.guardarUsuario(usuario)
                        .subscribe( resp=>{
                         console.log(resp);
                        },error=>{
                          console.log(error);
                        });
  }

  abrirModal(usuario:Usuario){
    console.log(usuario);
    this.modalImagenService.abrirModal('usuarios',usuario.uid,usuario.img);
  }
}

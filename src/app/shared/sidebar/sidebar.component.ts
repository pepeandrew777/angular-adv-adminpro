import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import {Usuario} from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {
  public imgUrl = '';
  public usuario:Usuario;
  menuItems:any[];

  constructor(private sidebarService:SidebarService,private usuarioService: UsuarioService) { 
    this.menuItems = sidebarService.menu;
    //this.imgUrl = usuarioService.usuario.imagenUrl;
    this.usuario = usuarioService.usuario;
    //console.log(this.menuItems);ç
  }
  ngOnInit(): void {
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  // se crea con ionic g service/authservice

  private authenticated = false;

  constructor() { }

  isLoggedIn(){
    return this.authenticated; // Estado que retornara la clase
  }

  login(){
    this.authenticated = true; // Cambia estado si el login es exisotoso
  }

  logout(){
    this.authenticated = false; // cambia estado para salir de la app
  }
}

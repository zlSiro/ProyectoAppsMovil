import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { AuthServiceService } from '../service/auth-service.service'; 
import { AlertController } from '@ionic/angular';
import { ConsumoApiService } from '../service/consumo-api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})



export class LoginPage implements OnInit {

  constructor(
    private router: Router, 
    private alertController: AlertController, 
    private authService: AuthServiceService,
    private consumoApi: ConsumoApiService) { }

  //metodo que permite ir al home(en vez de routerLink que es como un HREF)
  navegar(){
    this.router.navigate(['/home']);
  }

  usuario = new FormGroup({

    user: new FormControl('',[Validators.required, Validators.minLength(4),Validators.maxLength(20)]),  
    pass: new FormControl('',[Validators.required, Validators.minLength(4),Validators.maxLength(20)]),
    
   });
  
   async navegarExtras() {
    const correo = this.usuario.value.user || '';
    const password = this.usuario.value.pass || '';

    try {
      // Llama al método de autenticación de la API
      this.consumoApi.login(correo, password).subscribe(
        (response) => {
          // Cambia el estado de autenticación en AuthService
          this.authService.login();

          // Crea el conjunto de datos para la navegación
          let setData: NavigationExtras = {
            state: {
              id: response.id,
              nombre: response.nombre,
              user: response.user,
              correo: response.correo,
              tipoPerfil: response.tipoPerfil
            }
          };

          // Redirige según el tipo de perfil
          if (response.tipoPerfil === 1) {
            this.router.navigate(['/home'], setData);
          } else if (response.tipoPerfil === 2) {
            this.router.navigate(['/home-alumno'], setData);
          }
        },
        (error) => {
          // Muestra un mensaje de error si las credenciales son incorrectas
          this.presentAlert("Error Login", "Usuario y/o contraseña son incorrectos");
        }
      );
    } catch (error: any) {
      this.presentAlert("Error Login", error.message || error);
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

      /* const loginMap: { [key: string]: string} = {
        'profesor:1234': '/home',
        'estudiante:1234': '/alumno'
      }; */


      /* const userPassKey = `${this.usuario.value.user}:${this.usuario.value.pass}`;
      if (loginMap[userPassKey]) {
        this.router.navigate([loginMap[userPassKey]], setData);
      } else {
        this.presentAlert("Error Login", "Usuario y/o contraseña son incorrectos")
      } */

  ngOnInit() : void {
    this.navegar()
  }

}
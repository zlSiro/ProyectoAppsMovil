import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ConsumoApiService } from '../service/consumo-api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  now = new Date();
  user = "";
  fecha = this.now.toLocaleString();

  //Crear un listado de cursos(un arreglo vacio)
  cursos : any[] = [];

  // Id del profesor Dinamico
  profesorId: number | null = null;

  constructor(
    private activateroute: ActivatedRoute,
    private consumoApi: ConsumoApiService,
    private router: Router) {

      this.activateroute.queryParams.subscribe(params => {
        if(this.router.getCurrentNavigation()?.extras.state) {
          this.user = this.router.getCurrentNavigation()?.extras.state?.['nombre'];
          this.profesorId = this.router.getCurrentNavigation()?.extras.state?.['id'];
        }
      });
    }
  
  // Crear metodo para consumir el service
  getPostServices(profesorId: number) {
    this.consumoApi.obtenerCursosProfesor(profesorId).subscribe(
      (respuesta) => {
      this.cursos = respuesta;
    },
      (error) => {
        console.error('Error al obtener cursos: ', error)
      }
    )
  }
  
  verDetalle(nombreCurso: string, idCurso: number, codigoCurso: string, seccionCurso: string) {
    let setData: NavigationExtras = {
      state: {
        nombre: nombreCurso,
        id: idCurso,
        codigo: codigoCurso,
        seccion: seccionCurso,
        idProfesor: this.profesorId
      }
    };

    this.router.navigate(['/detalle-curso'], setData)
  }
  
  //Metodo que permite navergar como si fuera un HREF
  navegar(){
    this.router.navigate(['/home']);
  }

  ngOnInit(): void {
    if (this.profesorId) {
      // Llamar al servicio solo si el ID del profesor esta disponible
      this.getPostServices(this.profesorId); 
    } else{
      console.error('ID del profesor no disponible');
    }
  }
}

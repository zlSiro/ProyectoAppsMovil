import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.page.html',
  styleUrls: ['./alumno.page.scss'],
})
export class AlumnoPage implements OnInit {

  constructor(private router: Router) { }
  //Metodo que permite navergar como si fuera un HREF
  navegar(){
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.navegar()
  }

}

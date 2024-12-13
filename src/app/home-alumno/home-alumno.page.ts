import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsumoApiService } from '../service/consumo-api.service';
import { Camera } from '@capacitor/camera';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { AlertController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-home-alumno',
  templateUrl: './home-alumno.page.html',
  styleUrls: ['./home-alumno.page.scss'],
})
export class HomeAlumnoPage implements OnInit {

  imageUrl: string | undefined;
  userHome: any;
  idAlumno: any;

  constructor(
    private qrScanner: QRScanner,
    private activeroute: ActivatedRoute,
    private router: Router,
    private apiService: ConsumoApiService,
    private alertController: AlertController
  ) { 
    this.activeroute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state) {
        this.userHome = this.router.getCurrentNavigation()?.extras.state?.['correo'];
        this.idAlumno = this.router.getCurrentNavigation()?.extras.state?.['id'];
      }
    });
  }
  
  ngOnInit() {
    this.requestCameraPermission();
  }

  async requestCameraPermission() {
    if (Capacitor.getPlatform() !== 'web') {
      const cameraStatus = await Camera.checkPermissions();
      console.log('Estado de permisos:', cameraStatus);
  
      if (cameraStatus.camera !== 'granted') {
        console.log('Permisos no otorgados, solicitando...');
        await Camera.requestPermissions();
      }
      this.startScanner();
    }
  }

  async startScanner() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            const [codigo, seccion, fecha] = text.split('-');
            this.registrarAsistencia(codigo, seccion, fecha);
            this.qrScanner.hide();
            scanSub.unsubscribe();
          });

          this.qrScanner.show();
        } else if (status.denied) {
          this.showSettingsAlert();
        }
      })
      .catch((e: any) => console.log('Error:', e));
  }

  async showSettingsAlert() {
    const alert = await this.alertController.create({
      header: 'Permiso de Cámara',
      message: 'Se necesita acceso a la cámara para escanear códigos QR. Por favor, habilite el acceso a la cámara en la configuración de su dispositivo.',
      buttons: ['OK']
    });

    await alert.present();
  }

  registrarAsistencia(codigo: string, seccion: string, fecha: string) {
    const body = {
      alumno_id: this.idAlumno,
      codigo: codigo,
      seccion: seccion,
      fecha: fecha
    };

    this.apiService.registrarAsistencia(this.idAlumno, codigo, seccion, fecha).subscribe(response => {
      console.log(response);
      console.log('Datos enviados para asistencia:', body);
    });
  }

}

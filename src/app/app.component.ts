import { Component } from '@angular/core';
import { Platform, AlertController, Alert, LoadingController, Loading, ToastController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Insomnia } from '@ionic-native/insomnia';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Subscription } from 'rxjs';

import { GaugeScreen } from '../pages/gauge/gauge';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private onResumeSubscription: Subscription;
  private loading: Loading;
  private alert: Alert;

  rootPage:any = GaugeScreen;

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    insomnia: Insomnia, 
    private bluetooth: BluetoothSerial, 
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private events: Events) {
    
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.onResumeSubscription = platform.resume.subscribe(() => { 
          this.isBluetoothAtivo();
        } 
      );

      insomnia.keepAwake()
        .then(
          () => console.log('success'),
          () => console.log('error')
      );
        
      this.isBluetoothAtivo();
    });
  }

  isBluetoothAtivo(){
    this.bluetooth.isEnabled()
    .then(
        () => this.bluetooth
        .isConnected()
        .then(
          () => { 
            this.bluetooth.disconnect(); 
            this.listarDispositivos();
          }, //exibir o contagiros
          () => this.listarDispositivos()),

        () => this.bluetooth.showBluetoothSettings()
    );
  }

  listarDispositivos(){
    console.log('listing bluetooth devices');

    this.bluetooth.list()
    .then(
      (devices) => this.showModalDispositivos(devices), 
      () => console.log("falha list")
     );
  }

  showModalDispositivos(devices: Array<any>){
    if (this.alert != null) {
      this.alert.dismiss();
    }

    this.alert = this.alertCtrl.create( {enableBackdropDismiss: false} );
    this.alert.setTitle("Dispositivos");

    for(var device of devices){
      this.alert.addInput({
        type: 'radio',
        label: device.name,
        value: device.address
      });
    }

    this.alert.addButton({
      text: 'Ok',
      handler: (data: any) => {     
        if (data === undefined) {
           return false;
        }   
        this.criarModalLoading();
        this.loading.present();
        this.conectarDispositivo(data);
      }
    });

    this.alert.present();
  }

  conectarDispositivo(addr: any){
    this.bluetooth.connect(addr).subscribe(
      () => { //onNext
        this.loading.dismiss();
        this.bluetooth.subscribe(';')
        .subscribe((data: any) => {
          this.events.publish('rpm', parseInt(data.replace(';', '')) * 30);
        });
      },
      () => { //onError
        this.loading.dismiss(); 
        this.exibirToast('Não foi possível conectar ao dispositivo.');
        setTimeout(() => {
          this.listarDispositivos();
        }, 3000);
      }, 
      () => { this.exibirToast('onComplete'); } //onComplete
      );
  }

  ngOnDestroy(){
    this.onResumeSubscription.unsubscribe();
  }

  criarModalLoading(){
    this.loading = this.loadCtrl.create({
      content: 'Conectando...'
    });
  }

  exibirToast(texto: string){
    let toast = this.toastCtrl.create({
      message: texto,
      duration: 3000
    });

    toast.present();
  }
}


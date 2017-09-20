import { Component } from '@angular/core';
import { Platform, AlertController, Alert, LoadingController, Loading, ToastController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Insomnia } from '@ionic-native/insomnia';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AppPreferences } from '@ionic-native/app-preferences';
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

  constructor(private platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    insomnia: Insomnia, 
    private bluetooth: BluetoothSerial, 
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private events: Events,
    private appPreferences: AppPreferences) {
    
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

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
    .then(() => this.bluetooth.isConnected()
      .then(() => {
          //conectado
          this.bluetooth.disconnect(); 
          this.listarDispositivos();
        },
        () => {
          //nao conectado
          this.appPreferences.fetch('device').then(
            (device) => this.conectarDispositivo(device), 
            () => { this.listarDispositivos() }
          );          
        }
      ),
        () => {
          this.onResumeSubscription = this.platform.resume.subscribe(() => {
            //quando voltar da tela de config bluetooth, exibe a lista de devices
            this.onResumeSubscription.unsubscribe();
            this.isBluetoothAtivo();
          });
          this.bluetooth.showBluetoothSettings();
        }
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
        this.conectarDispositivo(data);
      }
    });

    this.alert.present();
  }

  conectarDispositivo(addr: any){
    this.criarModalLoading();
    this.loading.present();
        
    this.bluetooth.connect(addr).subscribe(
      () => { //onNext
        this.appPreferences.store('device', addr);
        this.loading.dismiss();
        this.bluetooth.subscribe(';')
        .subscribe((data: any) => {
          this.events.publish('rpm', parseInt(data.replace(';', '')) * 30);
        });
      },
      () => { //onError
        this.loading.dismiss(); 
        this.events.publish('rpm', 0);
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


import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Insomnia } from '@ionic-native/insomnia';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Subscription } from 'rxjs';
import { AlertController } from 'ionic-angular';

import { GaugeScreen } from '../pages/gauge/gauge';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private onResumeSubscription: Subscription;
  private bluetooth: BluetoothSerial;

  rootPage:any = GaugeScreen;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, insomnia: Insomnia, bt: BluetoothSerial, private alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.bluetooth = bt;

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
        () => this.bluetooth.isConnected().then(
                              () => console.log("conectado"), //exibir o contagiros
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
    let alert = this.alertCtrl.create();
    alert.setTitle("Dispositivos");

    for(var device of devices){
      alert.addInput({
        type: 'radio',
        label: device.name,
        value: device.address
      });
    }

    alert.addButton({
      text: 'Ok',
      handler: (data: any) => {
        console.log(data);
      }
    });

    alert.present();
  }

  ngOnDestroy(){
    this.onResumeSubscription.unsubscribe();
  }
}


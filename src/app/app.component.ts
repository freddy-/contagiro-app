import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Insomnia } from '@ionic-native/insomnia';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { GaugeScreen } from '../pages/gauge/gauge';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = GaugeScreen;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, insomnia: Insomnia, bluetooth: BluetoothSerial) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      insomnia.keepAwake()
        .then(
          () => console.log('success'),
          () => console.log('error')
      );

      bluetooth.isEnabled()
      .then(
          () => console.log('bluetooth success'),
          () => console.log('bluetooth error')        
      );
    });
  }
}


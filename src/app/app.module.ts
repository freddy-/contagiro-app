import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Insomnia } from '@ionic-native/insomnia';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AppPreferences } from '@ionic-native/app-preferences';


import { MyApp } from './app.component';
import { GaugeScreen } from '../pages/gauge/gauge';

@NgModule({
  declarations: [ // put all your components / directives / pipes here
    MyApp,
    GaugeScreen
  ],
  imports: [ // put all your modules here
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GaugeScreen
  ],
  providers: [ // put all your services here
    StatusBar,
    SplashScreen,
    Insomnia,
    BluetoothSerial,
    AppPreferences,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

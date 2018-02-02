import { Component, NgZone } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import _ from 'underscore';

@Component({
  selector: 'page-gauge',
  templateUrl: 'gauge.html'
})
export class GaugeScreen {

	escala: number = 316;
	agulha: number = 285;
	private rpm: number = 0;
	animacaoInicial: boolean = true;
  private throttleCalcularRPM: any;

  constructor(
    public navCtrl: NavController,
    private events: Events,
    private _ngZone: NgZone,
    private bluetooth: BluetoothSerial) {

  	this.exibirAnimacaoInicial();
    this.observarRPM();
    this.throttleCalcularRPM = _.throttle(this.calcularRPM, 100);

    //TODO double tap na tela do contagiros permite setar o SHIFT LIGHT
  }

  calcularRPM(rpm){
    this.rpm = rpm;
    //if(rpm <= 1000){
    //  this.escala = this.map(rpm, 0.0, 1000.0, 316.0, 325.0);
    //  this.agulha = this.map(rpm, 0.0, 1000.0, 285.0, 298.0);
    //}else{
      this.escala = this.map(rpm, 0, 6000.0, 325.0, 391.0);
      this.agulha = this.map(rpm, 0, 6000.0, 274.0, 450.0);
    //}
  }

  observarRPM(){
    this.events.subscribe('start', (p) => {
      this.bluetooth.subscribe(';').subscribe((data: any) => {
          this._ngZone.run(() => this.calcularRPM(parseInt(data.replace(';', '')) * 30));
      });
    });
  }

  habilitaSetShiftLight(){
    console.log("TOUCH!");
    //entra no modo SET
    //unsubscribe do bluetooth, ou do listener que ele retorna
    //seta o ponteiro com o valor da ultima configuração
  }

  setShiftLight(evt){
    var newRpm = this.rpm + evt.deltaX;

    if (newRpm < 0) {
      newRpm = 0;
    }else if (newRpm > 6000) {
      newRpm = 6000;
    }

    this.calcularRPM(newRpm);
  }

  exibirAnimacaoInicial(){
    this.calcularRPM(0);
    setTimeout(() => {
      this.calcularRPM(6000);
      setTimeout(() => {
        this.calcularRPM(0);
        setTimeout(() => {
          this.animacaoInicial = false;
        }, 1000);
      }, 1200);
    }, 250);
  }

  map(x, inMin, inMax, outMin, outMax){
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

}

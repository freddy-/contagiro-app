import { Component, NgZone } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import _ from 'underscore';

@Component({
  selector: 'page-gauge',
  templateUrl: 'gauge.html'
})
export class GaugeScreen {

	escala: number = 316;
	agulha: number = 285;
	private rpm: number = 666;
	animacaoInicial: boolean = true;
  private throttleCalcularRPM: any;

  constructor(public navCtrl: NavController, private events: Events, private _ngZone: NgZone) {
  	this.exibirAnimacaoInicial();
    this.observarRPM();
    this.throttleCalcularRPM = _.throttle(this.calcularRPM, 100);
  }

  calcularRPM(rpm){
    this.rpm = rpm;
    if(rpm <= 1000){
      this.escala = this.map(rpm, 0.0, 1000.0, 316.0, 325.0);
      this.agulha = this.map(rpm, 0.0, 1000.0, 285.0, 298.0);
    }else{
      this.escala = this.map(rpm, 1000.0, 9000.0, 325.0, 440.0);
      this.agulha = this.map(rpm, 1000.0, 9000.0, 298.0, 437.0);
    }    
  }

  observarRPM(){
    this.events.subscribe('rpm', (rpm) => {
      this._ngZone.run(() => this.calcularRPM(rpm));
    });      
  }

  exibirAnimacaoInicial(){
    this.calcularRPM(0);
    setTimeout(() => {
      this.calcularRPM(9000);
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

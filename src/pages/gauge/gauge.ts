import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-gauge',
  templateUrl: 'gauge.html'
})
export class GaugeScreen {

	escala: number = 316;
	agulha: number = 285;
	rpm: number = 0;
	animacaoInicial: boolean = true;

  constructor(public navCtrl: NavController) {

  	//animação inicial
  	this.calculaRPM(0);
  	setTimeout(() => {
  		this.calculaRPM(9000);
  		setTimeout(() => {
  			this.calculaRPM(0);  	
  			setTimeout(() => {	
	  			this.animacaoInicial = false;	
	  		}, 1000);
  		}, 1200);
  	}, 250);

  }

  calculaRPM(rpm){
    if(rpm <= 1000){
      this.escala = this.map(rpm, 0.0, 1000.0, 316.0, 325.0);
      this.agulha = this.map(rpm, 0.0, 1000.0, 285.0, 298.0);
    }else{
      this.escala = this.map(rpm, 1000.0, 9000.0, 325.0, 440.0);
      this.agulha = this.map(rpm, 1000.0, 9000.0, 298.0, 437.0);
    }    
  }

  map(x, inMin, inMax, outMin, outMax){
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

}

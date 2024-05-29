import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";

@Injectable({
    providedIn: 'root'
  })

export class loading{
    constructor(private loadingCtrl: LoadingController){}

async showLoading(duration: number) {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
      duration: duration,
    });

    loading.present();
  }
}
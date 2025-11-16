import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/model/service/firebase.service';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/model/service/auth.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss'],
})
export class EmployeesPage implements OnInit {
  farm: any;
  farmId!: string;
  ownerUid!: string;
  currentUid!: string;
  isOwner: boolean = false;

  employees: any[] = []; // agora é lista de objetos (nome, email, foto)

  constructor(
    private router: Router,
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
    private auth: AuthService
  ) {
    const nav = this.router.getCurrentNavigation();
    const state: any = nav?.extras?.state;

    this.farm = state?.farm;
    this.farmId = this.farm?.id;
    this.ownerUid = this.farm?.ownerUid;
    this.currentUid = this.auth.getUserLogged()?.uid;

    this.isOwner = this.currentUid === this.ownerUid;
  }

  async ngOnInit() {
    const emails = this.farm.allowedUsers ?? [];

    this.employees = [];

    for (const email of emails) {
      const userData = await this.firebaseService.getUserByEmail(email);
      this.employees.push({
        email,
        name: userData?.name || email,
        photoURL: userData?.photoURL || 'assets/default-avatar.png'
      });
    }
  }

  back() {
    this.router.navigate(['/farm']);
  }

  openAddEmployee() {
    this.router.navigate(['/add-employee'], { state: { farm: this.farm } });
  }

  async removeEmployee(email: string) {
    const alert = await this.alertCtrl.create({
      header: 'Remover Funcionário',
      message: `Deseja remover <b>${email}</b>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },

        {
          text: 'Remover',
          role: 'destructive',
          handler: async () => {
            await this.firebaseService.removeEmployeeFromFarm(this.farm.id, email);
            this.employees = this.employees.filter(e => e.email !== email);
          }
        }
      ]
    });

    await alert.present();
  }
}

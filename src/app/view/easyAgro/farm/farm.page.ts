import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Alert } from 'src/app/common/alert';
import { confirmAlert } from 'src/app/common/confirmAlert';
import { loading } from 'src/app/common/loading';
import { Farm } from 'src/app/model/entities/farm';
import { AuthService } from 'src/app/model/service/auth.service';
import { FirebaseService } from 'src/app/model/service/firebase.service';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.page.html',
  styleUrls: ['./farm.page.scss'],
})
export class FarmPage implements OnInit {
  farmForm!: FormGroup;
  public farms: Farm[] = [];
  farmID: string | null = null;
  showNoFarms = false;
  user: any;
  isPopoverOpen = false;
  popoverEvent: any;
  selectedFarm!: Farm;

  constructor(private router: Router, private formBuilder: FormBuilder, private firebaseService: FirebaseService, private auth: AuthService, private alert: Alert, private loading: loading, private confirmAlert: confirmAlert, private alertCtrl: AlertController) {
    this.user = this.auth.getUserLogged();
    this.getFams();
  }

  ngOnInit() {
    this.farmForm = this.formBuilder.group({
      farmName: ['', [Validators.required, Validators.minLength(5)]],
      farmLocation: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  openOptions(event: any, farm: Farm) {
    this.popoverEvent = event;
    this.selectedFarm = farm;
    this.isPopoverOpen = true;
  }

  viewVaccines(farm: Farm) {
    this.isPopoverOpen = false;
    this.router.navigate(['/farm-vaccines'], { state: { farm } });
  }

  viewFeedings(farm: Farm) {
    this.isPopoverOpen = false;
    this.router.navigate(['/farm-feedings'], { state: { farm } });
  }

  editFarm(farm: Farm) {
    this.isPopoverOpen = false;
    this.router.navigate(['/edit-farm'], { state: { farm } });
  }

    openFarm(farm: Farm){
    this.loading.showLoading(50);
    this.farmID = farm.newFarmId;
    this.router.navigateByUrl('/farm-details', { state: { farm } });
  }

  createFarm() {
    if (this.farmForm.valid) {
      this.loading.showLoading(50);
      const newFarm = new Farm();
      newFarm.farmName = this.farmForm.value.farmName;
      newFarm.location = this.farmForm.value.farmLocation;
      newFarm.uid = this.user.uid;
      newFarm.newFarmId = this.firebaseService.generateId();

      this.firebaseService.registerFarm(newFarm, this.user.email)
        .then(() => {
          this.farmForm.reset();
          this.getFams();
        })
        .catch((error) => {
          console.error('Erro ao criar a fazenda:', error);
          this.alert.presentAlert('Erro!', 'Ocorreu um erro ao criar a fazenda.');
        })
    } else {
      this.alert.presentAlert('Erro!', 'Todos os campos são obrigatórios!');
    }
  }

  deleteFarm(farm: Farm) {
    this.isPopoverOpen = false;
    this.confirmAlert.presentConfirmAlert(
      'ATENÇÃO',
      'Você realmente deseja deletar essa fazenda?',
      (confirmed) => {
        if (confirmed) {
          this.firebaseService
            .deleteFarm(farm.id)
            .then(() => {
              this.alert.presentAlert('Sucesso', 'Fazenda excluída com sucesso!');
              this.getFams();
            })
            .catch((error) => {
              console.log(error);
              this.alert.presentAlert('Erro', 'Erro ao excluir a fazenda!');
            });
        }
      }
    );
  }

  getFams() {
    const email = this.user.email;

    this.firebaseService.getFarms(email).subscribe((res: any[]) => {
      this.farms = res.map(f => ({
        id: f.payload.doc.id,
        ...f.payload.doc.data() 
      }));
    });
  }

    addEmployeeRoute(farm: Farm) {
    this.isPopoverOpen = false;
    this.router.navigate(['/employees'], { state: { farm } });
  }

    disableFarmsListAndShowNoFarms() {
      this.router.navigate(['/add-farm']);
    }

    goToProfilePage() {
      this.router.navigate(['/profile']);
    }

    openVaccineVisualizer(farm: Farm) {
      this.farmID = farm.newFarmId;
      this.router.navigateByUrl('/vaccine-management-visualizer', { state: { farm } });
    }

    openFeedingVisualizer(farm: Farm) {
    this.farmID = farm.newFarmId;
    this.router.navigateByUrl('/feeding-management-visualizer', { state: { farm } });
  }

  goTolotManagement(farm: Farm){
    this.isPopoverOpen = false;
    this.router.navigate(['/lot-management'], { state: { farm} });
  }

  async addEmployee(farm: any) {
    const alert = await this.alertCtrl.create({
      header: 'Adicionar Funcionário',
      inputs: [
        { name: 'email', type: 'email', placeholder: 'Email do funcionário' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Adicionar',
          handler: async (data: any) => {
            if (!data.email || !data.email.includes('@')) {
              this.alert.presentAlert('Erro', 'Email inválido');
              return false;
            }
            await this.firebaseService.addEmployeeToFarm(farm.id, data.email);

            this.alert.presentAlert('Sucesso', 'Funcionário adicionado!');
            return true;
          }
        }
      ]
    });

    await alert.present();
  }
}

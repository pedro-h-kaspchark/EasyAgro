import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { Alert } from 'src/app/common/alert';
import { confirmAlert } from 'src/app/common/confirmAlert';
import { loading } from 'src/app/common/loading';
import { Animal } from 'src/app/model/entities/Animal';
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
  showNoFarms: boolean = false;
  farmID: string | null = null;
  user: any;
  animal!: Animal;

  constructor(private router: Router, private formBuilder: FormBuilder, private firebaseService: FirebaseService, private auth: AuthService, private alert: Alert, private loading: loading, private confirmAlert: confirmAlert) {
    this.getFarms();
    this.user = this.auth.getUserLogged();
    this.farmForm = new FormGroup({
      farmName: new FormControl(''),
      farmLocation: new FormControl(''),
    });
  }

  ngOnInit() {
    this.farmForm = this.formBuilder.group({
      farmName: ['', Validators.required],
      farmLocation: ['', Validators.required]
    });
    if (this.farms.length === 0) {
      this.showNoFarms = true;
    }
    this.getFarms();
  }

  createFarm(){
    if (this.farmForm.valid) {
      this.loading.showLoading(50);
      const newFarm: Farm = new Farm();
        newFarm.farmName = this.farmForm.value.farmName,
        newFarm.location = this.farmForm.value.farmLocation;
        newFarm.uid = this.user.uid,
        newFarm.farmId = this.firebaseService.generateId()

      this.firebaseService.registerFarm(newFarm).then(() => {
        this.farmForm.reset();
        this.getFarms();
      }).catch(error => {
        console.error('Erro ao criar a fazenda:', error);
        this.alert.presentAlert('Erro!', 'Ocorreu um erro ao criar a fazenda.');
      });
    } else {
      this.alert.presentAlert('Erro!', 'Todos os campos são obrigatórios!');
    }
  }

  deleteFarm(farm: Farm) {
    this.confirmAlert.presentConfirmAlert("ATENÇÃO", "Você realmente deseja deletar essa fazenda?", (confirmed) => {
      if (confirmed) {
        this.loading.showLoading(10);
        this.firebaseService.deleteFarm(farm.id).then(() => {
          this.alert.presentAlert('Sucesso', 'Fazenda excluída com sucesso!');
          this.getFarms();
        }).catch((error) => {
          console.log(error);
          this.alert.presentAlert('Erro', 'Erro ao excluir a fazenda!');
        });
      }
    });
  }

  disableFarmsListAndShowNoFarms() {
    this.router.navigate(['/add-farm']);
  }

  enableFarmsList() {
    this.showNoFarms = false;
    this.getFarms();
  }

  getFarms() {
    this.firebaseService.getAllFarms().subscribe(res => {
      this.farms = res.map(user => {
        return { id: user.payload.doc.id, ...user.payload.doc.data() as any } as Farm
      })
    });
  }

  openFarm(farm: Farm){
    this.loading.showLoading(50);
    this.farmID = farm.farmId;
    this.router.navigateByUrl('/farm-details', { state: { farm } });
  }

  goToProfilePage() {
    this.router.navigate(['/profile']);
  }
}

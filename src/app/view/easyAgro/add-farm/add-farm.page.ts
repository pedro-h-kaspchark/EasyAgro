import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alert } from 'src/app/common/alert';
import { loading } from 'src/app/common/loading';
import { Farm } from 'src/app/model/entities/farm';
import { AuthService } from 'src/app/model/service/auth.service';
import { FirebaseService } from 'src/app/model/service/firebase.service';

@Component({
  selector: 'app-add-farm',
  templateUrl: './add-farm.page.html',
  styleUrls: ['./add-farm.page.scss'],
})
export class AddFarmPage implements OnInit {
  user!: any;
  farmForm!: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private firebaseService: FirebaseService, private auth: AuthService, private alert: Alert, private loading: loading){
    this.user = this.auth.getUserLogged();
    this.farmForm = new FormGroup({
      farmName: new FormControl(''),
      farmLocation: new FormControl(''),
    });
  }

  ngOnInit() {
    this.farmForm = this.formBuilder.group({
      farmName: ['', [Validators.required, Validators.minLength(5)]],
      farmLocation: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  enableFarmsList(){
    this.router.navigate(['/farm']);
  }

  createFarm(){
    if (this.farmForm.valid) {
      this.loading.showLoading(50);
      const newFarm: Farm = new Farm();
        newFarm.farmName = this.farmForm.value.farmName,
        newFarm.location = this.farmForm.value.farmLocation;
        newFarm.uid = this.user.uid,
        newFarm.newFarmId = this.firebaseService.generateId();

      const ownerEmail = this.auth.getUserLogged().email;
      this.firebaseService.registerFarm(newFarm, ownerEmail).then(() => {
        this.farmForm.reset();
        this.router.navigate(['/farm']);
      }).catch(error => {
        console.error('Erro ao criar a fazenda:', error);
        this.alert.presentAlert('Erro!', 'Ocorreu um erro ao criar a fazenda.');
      });
    }else{
      this.alert.presentAlert('Erro!', 'Todos os campos são obrigatórios!');
    }
  }

}

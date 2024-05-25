import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alert } from 'src/app/common/alert';
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

  constructor(private router: Router, private formBuilder: FormBuilder, private firebaseService: FirebaseService, private auth: AuthService, private alert: Alert){
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
  }

  enableFarmsList(){
    this.router.navigate(['/farm']);
  }

  createFarm() {
    if (this.farmForm.valid) {
      const newFarm: Farm = new Farm();
        newFarm.farmName = this.farmForm.value.farmName,
        newFarm.location = this.farmForm.value.farmLocation;
        newFarm.uid = this.user.uid,
        newFarm.id = this.firebaseService.generateId()

      this.firebaseService.registerFarm(newFarm).then(() => {
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

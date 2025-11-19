import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/model/service/firebase.service';
import { Alert } from 'src/app/common/alert';
import { Farm } from 'src/app/model/entities/farm';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.page.html',
  styleUrls: ['./add-employee.page.scss'],
})
export class AddEmployeePage implements OnInit {

  form!: FormGroup;
  farm!: Farm;

  constructor(private fb: FormBuilder, private router: Router, private firebaseService: FirebaseService, private alert: Alert, private location: Location) {}

  ngOnInit() {
    this.farm = history.state.farm;
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  goBack() {
    this.location.back();
  }

async submit() {
    if (this.form.invalid) {
      this.alert.presentAlert('Erro', 'Digite um email válido.');
      return;
    }

    const email = this.form.value.email.toLowerCase();

    const userData = await this.firebaseService.getUserByEmail(email);
    if (!userData) {
      this.alert.presentAlert('Erro', 'Esse email não está registrado no sistema.');
      return;
    }
    if (this.farm.allowedUsers.includes(email)) {
      this.alert.presentAlert('Erro', 'Esse usuário já está cadastrado nessa fazenda.');
      return;
    }
    await this.firebaseService.addEmployeeToFarm(this.farm.id, email);
    this.alert.presentAlert('Sucesso', 'Funcionário adicionado!');
    this.router.navigate(['/employees'], { state: { farm: this.farm } });
  }
}

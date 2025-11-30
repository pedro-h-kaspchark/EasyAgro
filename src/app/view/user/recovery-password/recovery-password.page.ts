import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alert } from 'src/app/common/alert';
import { loading } from 'src/app/common/loading';
import { AuthService } from 'src/app/model/service/auth.service';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.page.html',
  styleUrls: ['./recovery-password.page.scss'],
})
export class RecoveryPasswordPage implements OnInit {
  recoveryPassForm!: FormGroup;
  
  constructor(private formBuilder: FormBuilder, private alert: Alert, private auth: AuthService, private router: Router, private loading: loading){
    
  }

  ngOnInit(){
    this.auth.getUserLogged();
    this.recoveryPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }
  get errorControl(){
    return this.recoveryPassForm.controls;
  }

  submitForm(): void {
    if (!this.recoveryPassForm.valid) {
      this.alert.presentAlert('Erro', 'Verifique seu E-mail');
    }else{
      this.auth.recoverPassword(this.recoveryPassForm.value['email']);
      this.alert.presentAlert('OK', 'E-mail de reset enviado');
      this.router.navigate(['/login']);
    }
  }

  goToRegisterPage(){
    this.router.navigate(['/register']);
  }

  goToLoginPage(){
    this.router.navigate(['/login']);
  }
}

import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alert } from 'src/app/common/alert';
import { loading } from 'src/app/common/loading';
import { AuthService } from 'src/app/model/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  
  constructor(private formBuilder: FormBuilder, private alert: Alert, private auth: AuthService, private router: Router, private loading: loading){
    
  }

  ngOnInit(){
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }
  get errorControl(){
    return this.loginForm.controls;
  }

  submitForm(){
    if(!this.loginForm.valid){
      this.alert.presentAlert("Erro", "Erro ao logar!")
    }else{
      this.signIn();
    }
  }
  signIn(){
    this.loading.showLoading(400);
    this.auth.signIn(this.loginForm.value['email'], this.loginForm.value['password']).then((res) => {
    this.alert.presentAlert("OK", "Bem vindo!"); this.router.navigate(['/farm'])}).catch((error) => {
    this.alert.presentAlert("Erro", "Erro ao efetuar o login!"); console.log(error);})
  }
  
  loginWithGmail(){
    this.auth.logInWithGoogle().then((res)=>{this.alert.presentAlert("OK", "Seja bem Vindo!"); this.router.navigate(['/farm']); }).catch((error)=>{
    this.alert.presentAlert("OK", "Erro ao Logar! Tente Novamente"); console.log(error);});
  }

  goToRegisterPage(){
    this.router.navigate(['/register']);
  }
}

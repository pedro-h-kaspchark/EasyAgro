import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alert } from 'src/app/common/alert';
import { AuthService } from 'src/app/model/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm! : FormGroup;
  imagem: any;

  constructor(private formBuilder: FormBuilder, private router: Router, private alert: Alert, private auth: AuthService){

  }

  ngOnInit(){
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confPassword: ['', [Validators.required, Validators.minLength(6)]],
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      number: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(13)]],
      photoURL: ['']
    })
  }

  getErrorControls(){
    return this.registerForm.controls;
  }

  uploadFile(imagem: any){
    this.imagem = imagem.files;
  }

  submitForm(){
    if(!this.registerForm.valid){
      this.alert.presentAlert("Erro", "Erro ao Cadastrar!")
    }else{
      this.register();
    }
  }
  private register(){
    this.auth.register(this.registerForm.value['email'], this.registerForm.value['password'], this.registerForm.value['displayName'], this.registerForm.value['photoURL'], this.registerForm.value['number']).then((res) => {
    this.alert.presentAlert("OK", "Conta Criada!");this.router.navigate(['/login'])}).catch((error) => {
    this.alert.presentAlert("Erro", "Erro ao cadastrar!"); console.log(error)});
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alert } from 'src/app/common/alert';
import { loading } from 'src/app/common/loading';
import { AuthService } from 'src/app/model/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm! : FormGroup;
  imagem: any;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private alert: Alert, private auth: AuthService, private loading: loading){

  }

  ngOnInit(){
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confPassword: ['', [Validators.required, Validators.minLength(6)]],
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(13)]],
      photoURL: ['']
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confPassword = form.get('confPassword');
    if (password && confPassword && password.value !== confPassword.value) {
      confPassword.setErrors({ passwordMismatch: true });
    } else {
      confPassword?.setErrors(null);
    }
  }

  getErrorControls(){
    return this.registerForm.controls;
  }

  uploadFile(imagem: any){
    this.loading.showLoading(20);
    this.imagem = imagem.files;
    this.alert.presentAlert("Ok", "Imagem salva!");
  }

  submitForm() {
    if (!this.registerForm.valid) {
      this.alert.presentAlert("Erro", "Preencha todos os campos corretamente!");
      return;
    }

    const formData = this.registerForm.value;
    const phoneNumber = formData.phoneNumber;

    const registerPromise = this.imagem && this.imagem.length > 0
      ? this.auth.register(formData.email, formData.password, formData.displayName, this.imagem[0], phoneNumber)
      : this.auth.registerWithoutPhoto(formData.email, formData.password, formData.displayName, phoneNumber);

    this.loading.showLoading(600);

    registerPromise
      .then(() => {
        this.alert.presentAlert("Sucesso", "Conta criada com sucesso!");
        return this.auth.signIn(formData.email, formData.password);
      })
      .then(() => {
        this.router.navigate(['/farm']);
      })
      .catch((error) => {
        this.handleAuthError(error);
        console.error(error);
      });
  }

  handleAuthError(error: any) {
    const errorCode = error.code;

    switch (errorCode) {

      case 'auth/email-already-in-use':
        this.alert.presentAlert("Erro", "Este e-mail já está em uso!");
        break;

      case 'auth/invalid-email':
        this.alert.presentAlert("Erro", "O e-mail informado é inválido!");
        break;

      case 'auth/weak-password':
        this.alert.presentAlert("Erro", "A senha deve ter pelo menos 6 caracteres!");
        break;

      case 'auth/network-request-failed':
        this.alert.presentAlert("Erro", "Falha de conexão. Verifique sua internet.");
        break;

      case 'auth/too-many-requests':
        this.alert.presentAlert("Erro", "Muitas tentativas. Tente novamente mais tarde.");
        break;

      default:
        this.alert.presentAlert("Erro", "Não foi possível criar a conta.");
        break;
    }
  }

  goToLoginPage(){
    this.router.navigate(['/login']);
  }
}
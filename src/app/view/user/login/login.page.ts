import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  showPassword = false;
  loadingLogin = false;

  constructor(
    private formBuilder: FormBuilder, private alert: Alert, private auth: AuthService, private router: Router, private loading: loading) {
      
    }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  async submitForm() {
    if (!this.loginForm.valid) {
      return this.alert.presentAlert("Erro", "Campos inválidos!");
    }
    this.signIn();
  }

  async signIn() {
    if (this.loadingLogin) return;
    this.loadingLogin = true;

    this.loading.showLoading(200);
    try {await this.auth.signInAndWaitAuth(this.loginForm.value.email, this.loginForm.value.password);
      this.router.navigate(['/farm']);
    } catch (error) {this.handleLoginError(error);

    }
    this.loadingLogin = false;
  }

  handleLoginError(error: any) {
    const code = error.code;

    switch (code) {
      case 'auth/user-not-found':
        this.alert.presentAlert("Erro", "Nenhuma conta encontrada com este e-mail.");
        break;

      case 'auth/wrong-password':
        this.alert.presentAlert("Erro", "Senha incorreta! Verifique e tente novamente.");
        break;

      case 'auth/invalid-email':
        this.alert.presentAlert("Erro", "E-mail inválido!");
        break;

      case 'auth/too-many-requests':
        this.alert.presentAlert("Erro", "Muitas tentativas. Tente novamente mais tarde.");
        break;

      case 'auth/network-request-failed':
        this.alert.presentAlert("Erro", "Falha de conexão. Verifique sua internet.");
        break;

      default:
        this.alert.presentAlert("Erro", "Não foi possível efetuar o login.");
        break;
    }
  }

  loginWithGmail() {
    this.auth.logInWithGoogle()
      .then(() => {
        this.alert.presentAlert("OK", "Seja bem-vindo!");
        this.router.navigate(['/farm']);
      })
      .catch((error) => {
        this.alert.presentAlert("Erro", "Erro ao Logar! Tente Novamente");
        console.log(error);
      });
  }

  goToRegisterPage() {
    this.router.navigate(['/register']);
  }

  goRecoveryPage() {
    this.router.navigate(['/recovery-password']);
  }
}
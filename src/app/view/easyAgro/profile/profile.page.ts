import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alert } from 'src/app/common/alert';
import { confirmAlert } from 'src/app/common/confirmAlert';
import { AuthService } from 'src/app/model/service/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userData: any;
  profileForm!: FormGroup;
  editMode: boolean = true;

  constructor(private router: Router, private auth: AuthService, private formBuilder: FormBuilder, private alert: Alert, private confirmAlert: confirmAlert, private loadingCtrl: LoadingController) {}

  ngOnInit() {
    this.loadUserData();
    this.profileForm = this.formBuilder.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(13)]],
      photoURL: ['']
    });
  }

  async loadUserData(){
    try{
      this.userData = await this.auth.getUserData();
      this.profileForm.patchValue({
        displayName: this.userData.displayName,
        phoneNumber: this.userData.phoneNumber
      });
    }catch (error){
      console.error('Erro ao carregar dados do usuário:', error);
    }
  }

  async submitForm(){
    try{
      const { displayName, phoneNumber } = this.profileForm.value;
      await this.auth.updateProfile(displayName, phoneNumber);
      this.alert.presentAlert("Ok", "Perfil atualizado!");
    }catch (error){
      console.error('Erro ao atualizar perfil');
    }
  }

  async uploadPhoto(event: any){
    this.showLoading();
    try{
      const file = event.target.files[0];
      if (file) {
        const downloadURL = await this.auth.uploadPhoto(file);
        this.alert.presentAlert("Ok", "Foto atualizada com sucesso!")
      }
    }catch (error){
      console.error('Erro ao fazer upload da foto de perfil');
    }
  }

  logOut(){
    this.confirmAlert.presentConfirmAlert("ATENÇÃO", "Deseja realmente sair da conta?", (confirmed) =>{if(confirmed){this.auth.signOut()}});
  }

  goToFarmPage() {
    this.router.navigate(['/farm']);
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
      duration: 800,
    });

    loading.present();
  }
}

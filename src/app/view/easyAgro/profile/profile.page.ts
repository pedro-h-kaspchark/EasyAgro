import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alert } from 'src/app/common/alert';
import { confirmAlert } from 'src/app/common/confirmAlert';
import { loading } from 'src/app/common/loading';
import { AuthService } from 'src/app/model/service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userData: any;
  profileForm!: FormGroup;
  editMode: boolean = true;

  constructor(private router: Router, private auth: AuthService, private formBuilder: FormBuilder, private alert: Alert, private confirmAlert: confirmAlert, private loading: loading) {}

  ngOnInit() {
    this.loadUserData();
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      number: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(13)]],
      photoURL: ['']
    });
  }

  async loadUserData(){
    try{
      this.userData = await this.auth.getUserData();
      this.profileForm.patchValue({
        name: this.userData.name,
        number: this.userData.number
      });
    }catch (error){
      console.error('Erro ao carregar dados do usuário:', error);
    }
  }

  async submitForm(){
    this.loading.showLoading(200);
    try{
      const { name, number } = this.profileForm.value;
      await this.auth.updateProfile(name, number);
      this.alert.presentAlert("Ok", "Perfil atualizado!");
    }catch (error){
      console.error('Erro ao atualizar perfil');
    }
  }

  async uploadPhoto(event: any){
    this.loading.showLoading(800);
    try{
      const file = event.target.files[0];
      if(file){
        const downloadURL = await this.auth.uploadPhoto(file);
        this.userData.photoURL = downloadURL;
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

}

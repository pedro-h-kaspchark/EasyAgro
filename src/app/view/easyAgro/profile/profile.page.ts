import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private router: Router, private auth: AuthService, private formBuilder: FormBuilder) {}

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
      console.log('Perfil atualizado com sucesso!');
    }catch (error){
      console.error('Erro ao atualizar perfil:', error);
    }
  }

  async uploadPhoto(event: any){
    try{
      const file = event.target.files[0];
      if (file) {
        const downloadURL = await this.auth.uploadPhoto(file);
        console.log('Foto de perfil atualizada com sucesso:', downloadURL);
      }
    }catch (error){
      console.error('Erro ao fazer upload da foto de perfil:', error);
    }
  }

  goToFarmPage() {
    this.router.navigate(['/farm']);
  }
}

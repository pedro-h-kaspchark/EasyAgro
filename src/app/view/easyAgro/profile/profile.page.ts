import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/model/service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit{
  userData: any;
  profileForm!: FormGroup;

  constructor(private router: Router, private auth: AuthService, private formBuilder: FormBuilder){ }

  ngOnInit(){
    this.loadUserData();
    this.profileForm = this.formBuilder.group({
      displayName: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(13)]],
      photoURL: ['']
    })
  }

  async loadUserData() {
    try {
      this.userData = await this.auth.getUserData();
    }catch (error){
      console.error('Erro ao carregar dados do usuário:', error);
    }
  }

  submitForm(){}

  goToHomePage(){
    this.router.navigate(['/home']);
  }
  goToFarmPage(){
    this.router.navigate(['/farm']);
  }
}
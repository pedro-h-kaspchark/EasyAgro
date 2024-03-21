import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/model/service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit{
  userData: any;

  constructor(private router: Router, private auth: AuthService){ }

  ngOnInit(){
    this.loadUserData();
  }

  async loadUserData() {
    try {
      this.userData = await this.auth.getUserData();
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  }

  goToHomePage(){
    this.router.navigate(['/home']);
  }
  goToFarmPage(){
    this.router.navigate(['/farm']);
  }
  goToEditProfile(){

  }
}
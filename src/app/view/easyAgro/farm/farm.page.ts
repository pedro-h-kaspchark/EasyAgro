import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.page.html',
  styleUrls: ['./farm.page.scss'],
})
export class FarmPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToProfilePage(){
    this.router.navigate(['/profile']);
  }
  goToHomePage(){
    this.router.navigate(['/home']);
  }
}

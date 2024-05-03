import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-farm-details',
  templateUrl: './farm-details.page.html',
  styleUrls: ['./farm-details.page.scss'],
})
export class FarmDetailsPage implements OnInit{
  showCreateForm = false;

  constructor() { }

  ngOnInit() {

  }
 
  openCreateForm(){
    this.showCreateForm = true;
  }
  closeCreateForm(){
    this.showCreateForm = false;
  }

}
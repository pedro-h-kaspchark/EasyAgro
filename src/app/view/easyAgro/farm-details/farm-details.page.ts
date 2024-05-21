import { Component, OnInit } from '@angular/core';
import { Animal } from 'src/app/model/entities/Animal';
import { Farm } from 'src/app/model/entities/farm';
import { user } from 'src/app/model/entities/user';
import { AuthService } from 'src/app/model/service/auth.service';
import { FirebaseService } from 'src/app/model/service/firebase.service';

@Component({
  selector: 'app-farm-details',
  templateUrl: './farm-details.page.html',
  styleUrls: ['./farm-details.page.scss'],
})
export class FarmDetailsPage implements OnInit {
  showCreateForm = false;
  showEditForm = false;
  selectedAnimal!: Animal;
  public animals: Animal[] = [];
  user!: user;
  farm!: Farm;
  farmName!: string;

  constructor(private authService: AuthService, private firebaseService: FirebaseService) {
    this.user = this.authService.getUserLogged();
  }

  ngOnInit() {
    this.farm = history.state.farm;
    this.farmName = this.farm.farmName;
    this.firebaseService.getAllAnimalsByFarmId().subscribe(res => {
      this.animals = res.map(animal => {
        return { id: animal.payload.doc.id, ...animal.payload.doc.data() as any } as Animal;
      });
    });
  }

  openCreateForm() {
    this.showCreateForm = true;
    this.showEditForm = false;
  }
  
  closeCreateForm() {
    this.showCreateForm = false;
  }

  openEditForm(animal: Animal) {
    this.selectedAnimal = animal;
    this.showEditForm = true;
    this.showCreateForm = false;
  }

  closeEditForm() {
    this.showEditForm = false;
  }
}

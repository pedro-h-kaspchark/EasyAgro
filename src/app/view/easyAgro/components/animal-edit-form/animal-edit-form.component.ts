import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FirebaseService } from 'src/app/model/service/firebase.service';
import { AuthService } from 'src/app/model/service/auth.service';
import { Animal } from 'src/app/model/entities/Animal';

@Component({
  selector: 'app-animal-edit-form',
  templateUrl: './animal-edit-form.component.html',
  styleUrls: ['./animal-edit-form.component.scss'],
})
export class AnimalEditFormComponent implements OnInit {
  @Input() animal!: Animal;
  animalForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService, private authService: AuthService) {}

  ngOnInit(): void {
    this.animalForm = this.formBuilder.group({
      name: [this.animal.name, Validators.required],
      species: [this.animal.species, Validators.required],
      birthDate: [this.animal.birthDate, Validators.required],
      number: [this.animal.number, Validators.required],
      historyOfIllnesses: [this.animal.historyOfIllnesses, Validators.required],
      treatmentHistory: [this.animal.treatmentHistory, Validators.required]
    });
  }

  editAnimal() {
    if (this.animalForm.valid) {
      const updatedAnimal = { ...this.animal, ...this.animalForm.value };
      this.firebaseService.editAnimal(updatedAnimal, this.animal.id).then(() => {
        console.log('Animal atualizado com sucesso!');
      }).catch(error => {
        console.error('Erro ao atualizar animal:', error);
      });
    }
  }
}

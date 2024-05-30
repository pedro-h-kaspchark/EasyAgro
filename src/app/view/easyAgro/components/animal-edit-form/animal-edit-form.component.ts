import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FirebaseService } from 'src/app/model/service/firebase.service';
import { AuthService } from 'src/app/model/service/auth.service';
import { Animal } from 'src/app/model/entities/Animal';
import { Alert } from 'src/app/common/alert';
import { Farm } from 'src/app/model/entities/farm';
import { loading } from 'src/app/common/loading';

@Component({
  selector: 'app-animal-edit-form',
  templateUrl: './animal-edit-form.component.html',
  styleUrls: ['./animal-edit-form.component.scss'],
})
export class AnimalEditFormComponent implements OnInit {
  @Input() farm!: Farm;
  @Input() animal!: Animal;
  @Output() animalUpdated = new EventEmitter<void>();
  @Output() closeEditForm = new EventEmitter<void>();
  animalForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService, private authService: AuthService, private alert: Alert, private loading: loading) {}

  ngOnInit(): void {
    this.animalForm = this.formBuilder.group({
      name: [{ value:this.animal.name, disabled: true }, Validators.required],
      species: [{ value:this.animal.species, disabled: true }, Validators.required],
      birthDate: [{ value:this.animal.birthDate, disabled: true }, Validators.required],
      number: [{ value:this.animal.number, disabled: true }, Validators.required],
      historyOfIllnesses: [this.animal.historyOfIllnesses, Validators.required],
      treatmentHistory: [this.animal.treatmentHistory, Validators.required]
    });
  }

  closeEdit(){
    this.closeEditForm.emit();
  }

  editAnimal() {
    if (this.animalForm.valid){
      this.loading.showLoading(10);
      const updatedAnimal: Animal = new Animal();
      updatedAnimal.name = this.animal.name;
      updatedAnimal.species = this.animal.species;
      updatedAnimal.birthDate = this.animal.birthDate;
      updatedAnimal.number = this.animal.number;
      updatedAnimal.historyOfIllnesses = this.animalForm.value.historyOfIllnesses;
      updatedAnimal.treatmentHistory = this.animalForm.value.treatmentHistory;
      updatedAnimal.uid = this.authService.getUserLogged().uid;
      updatedAnimal.farmId = this.animal.farmId;
      updatedAnimal.life = true;
      this.firebaseService.editAnimal(updatedAnimal, this.animal.id).then(() => {
        this.alert.presentAlert("Ok", "Animal atualizado");
        this.animalUpdated.emit();
      }).catch(error => {
        this.alert.presentAlert("Erro", "Erro ao atualizar o animal");
      });
    }else{
      this.alert.presentAlert("Erro", "campos inválidos!");
    }
  }
  
}

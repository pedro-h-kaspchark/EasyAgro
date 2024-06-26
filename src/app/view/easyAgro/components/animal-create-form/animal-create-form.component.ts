import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Alert } from 'src/app/common/alert';
import { loading } from 'src/app/common/loading';
import { Animal } from 'src/app/model/entities/Animal';
import { Farm } from 'src/app/model/entities/farm';
import { AuthService } from 'src/app/model/service/auth.service';
import { FirebaseService } from 'src/app/model/service/firebase.service';

@Component({
  selector: 'app-animal-create-form',
  templateUrl: './animal-create-form.component.html',
  styleUrls: ['./animal-create-form.component.scss'],
})

export class AnimalCreateFormComponent implements OnInit {
  animalForm!: FormGroup;
  @Input() farm!: Farm;
  @Output() animalRegistered = new EventEmitter<void>();
  @Output() closeForm = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService, private authService: AuthService, private alert: Alert, private loading: loading) { }

  ngOnInit(): void {
    this.animalForm = this.formBuilder.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      birthDate: ['', Validators.required],
      number: ['', Validators.required],
      historyOfIllnesses: ['nenhum', Validators.required],
      treatmentHistory: ['nenhum', Validators.required]
    });
  }

  closeCreateForm(){
    this.closeForm.emit();
  }


  registerAnimal(){
    if (this.animalForm.valid) {
      this.loading.showLoading(10);
      const animalData: Animal = new Animal();
      animalData.name = this.animalForm.value.name;
      animalData.species = this.animalForm.value.species;
      animalData.birthDate = this.animalForm.value.birthDate;
      animalData.number = this.animalForm.value.number;
      animalData.historyOfIllnesses = this.animalForm.value.historyOfIllnesses;
      animalData.treatmentHistory = this.animalForm.value.treatmentHistory;
      animalData.uid = this.authService.getUserLogged().uid;
      animalData.id = this.farm.farmId;
      animalData.farmId = this.farm.farmId;
      animalData.life = true;
      this.firebaseService.registerAnimal(animalData).then(() => {
          this.animalRegistered.emit();
          this.animalForm.reset();
        }).catch(error => {console.error('Erro ao registrar animal:', error);});
    }else{
      this.alert.presentAlert("Erro", "campos inválidos!");
    }
  }
}
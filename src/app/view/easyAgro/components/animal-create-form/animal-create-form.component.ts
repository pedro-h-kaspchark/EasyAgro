import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
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

  constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService, private authService: AuthService) { }

  ngOnInit(): void {
    this.animalForm = this.formBuilder.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      birthDate: ['', Validators.required],
      number: ['', Validators.required],
      historyOfIllnesses: ['', Validators.required],
      treatmentHistory: ['', Validators.required]
    });
  }


  registerAnimal(){
    if (this.animalForm.valid) {
      const animalData = this.animalForm.value;
      animalData.uid = this.authService.getUserLogged().uid;
      animalData.id = this.farm.id;
      this.firebaseService.registerAnimal(animalData).then(() => {
          console.log('Animal registrado com sucesso!');
          this.animalRegistered.emit();
          this.animalForm.reset();
        }).catch(error => {console.error('Erro ao registrar animal:', error);});
    }
  }
}
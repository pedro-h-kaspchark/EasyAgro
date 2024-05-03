import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FirebaseService } from 'src/app/model/service/firebase.service';

@Component({
  selector: 'app-animal-create-form',
  templateUrl: './animal-create-form.component.html',
  styleUrls: ['./animal-create-form.component.scss'],
})

export class AnimalCreateFormComponent implements OnInit {
  animalForm!: FormGroup;
  showCreateForm!: Boolean;

  constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService) { }

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


  onSubmit(): void {
    console.log(this.animalForm.value);
    this.firebaseService.createAnimal()
    };

  }
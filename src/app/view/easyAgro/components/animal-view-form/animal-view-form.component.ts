import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FirebaseService } from 'src/app/model/service/firebase.service';
import { AuthService } from 'src/app/model/service/auth.service';
import { Animal } from 'src/app/model/entities/Animal';
import { Alert } from 'src/app/common/alert';
import { Farm } from 'src/app/model/entities/farm';
import { loading } from 'src/app/common/loading';

@Component({
  selector: 'app-animal-view-form',
  templateUrl: './animal-view-form.component.html',
  styleUrls: ['./animal-view-form.component.scss'],
})
export class AnimalViewFormComponent  implements OnInit {
  @Input() farm!: Farm;
  @Input() animal!: Animal;
  @Output() closeEditForm = new EventEmitter<void>();
  animalForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService, private authService: AuthService, private alert: Alert, private loading: loading) {}

  ngOnInit(): void {
    this.animalForm = this.formBuilder.group({
      name: [{ value:this.animal.name, disabled: true }, Validators.required],
      species: [{ value:this.animal.species, disabled: true }, Validators.required],
      birthDate: [{ value:this.animal.birthDate, disabled: true }, Validators.required],
      deathDate: [{ value:this.animal.deathDate, disabled: true }, Validators.required],
      number: [{ value:this.animal.number, disabled: true }, Validators.required],
      historyOfIllnesses: [{ value:this.animal.historyOfIllnesses, disabled: true } , Validators.required],
      treatmentHistory: [{ value:this.animal.treatmentHistory, disabled: true }, Validators.required],
      animalType: [{ value:this.animal.type, disabled: true }, Validators.required],
    });
  }

  closeEdit(){
    this.closeEditForm.emit();
  }
  
}

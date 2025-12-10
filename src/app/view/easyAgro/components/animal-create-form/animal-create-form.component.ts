import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Alert } from 'src/app/common/alert';
import { loading } from 'src/app/common/loading';
import { Animal } from 'src/app/model/entities/Animal';
import { Farm } from 'src/app/model/entities/farm';
import { AuthService } from 'src/app/model/service/auth.service';
import { FirebaseService } from 'src/app/model/service/firebase.service';
import { LotService } from 'src/app/model/service/lot.service';

@Component({
  selector: 'app-animal-create-form',
  templateUrl: './animal-create-form.component.html',
  styleUrls: ['./animal-create-form.component.scss'],
})

export class AnimalCreateFormComponent implements OnInit {
  animalForm!: FormGroup;
  lotes: any[] = [];
  @Input() farm!: Farm;
  @Output() animalRegistered = new EventEmitter<void>();
  @Output() closeForm = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService, private authService: AuthService, private alert: Alert, private loading: loading, private lotService: LotService) { }

  ngOnInit(): void {
    this.animalForm = this.formBuilder.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      birthDate: ['', Validators.required],
      number: ['', Validators.required],
      animalType: ['', Validators.required],
      lotId: [''],
      historyOfIllnesses: ['nenhum', Validators.required],
      treatmentHistory: ['nenhum', Validators.required]
    });
    this.loadLots();
  }

  closeCreateForm(){
    this.closeForm.emit();
  }


registerAnimal() {
  if (this.animalForm.valid) {
    this.loading.showLoading(10);

    const animalData: Animal = new Animal();
    animalData.name = this.animalForm.value.name;
    animalData.species = this.animalForm.value.species;
    animalData.birthDate = this.animalForm.value.birthDate;
    animalData.number = this.animalForm.value.number;
    animalData.historyOfIllnesses = this.animalForm.value.historyOfIllnesses;
    animalData.treatmentHistory = this.animalForm.value.treatmentHistory;
    animalData.type = this.animalForm.value.animalType;
    animalData.lotId = this.animalForm.value.lotId;
    animalData.uid = this.authService.getUserLogged().uid;
    animalData.id = this.farm.newFarmId;
    animalData.farmId = this.farm.newFarmId;
    animalData.life = true;

    this.firebaseService.registerAnimal(animalData).then(() => {
      this.animalRegistered.emit();
      this.animalForm.reset();
      this.firstWarningShown = { name: false, species: false, birthDate: false, number: false };
    }).catch(error => {
      console.error('Erro ao registrar animal:', error);
    });

  } else {
    Object.keys(this.firstWarningShown).forEach(field => {
      this.firstWarningShown[field] = true;
    });
    this.animalForm.markAllAsTouched();
    this.alert.presentAlert("Erro", "Campos inválidos!");
  }
}

  firstWarningShown: any = {
    name: false,
    species: false,
    birthDate: false,
    number: false
  };

  handleWarning(field: string) {
    if (!this.firstWarningShown[field]) {
      this.firstWarningShown[field] = true;
    }
  }

  loadLots() {
    this.lotService.getLots().subscribe((lotes: any[]) => {
      this.lotes = lotes;
    });
  }
}
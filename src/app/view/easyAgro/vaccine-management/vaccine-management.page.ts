import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vaccine } from 'src/app/model/entities/Vaccine';
import { FirebaseService } from 'src/app/model/service/firebase.service';
import { loading } from 'src/app/common/loading';
import { Alert } from 'src/app/common/alert';
import { Farm } from 'src/app/model/entities/farm';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vaccine-management',
  templateUrl: './vaccine-management.page.html',
  styleUrls: ['./vaccine-management.page.scss'],
})
export class VaccineManagementPage implements OnInit {
  vaccineForm!: FormGroup;
  vaccines: Vaccine[] = [];
  farmID: string | null = null;
  farm!: Farm;
  animal: any;

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService, private loading: loading, private alert: Alert, private router: Router) {}

  ngOnInit() {
    this.animal = history.state.animal;
    this.vaccineForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
      notes: [''],
      administeredBy: ['', Validators.required]
    });
    this.loadVaccines();
  }

  loadVaccines() {
    if (!this.animal) return;
    this.firebaseService.getVaccinesByAnimal(this.animal.id).subscribe(res => {
      this.vaccines = res.map(v => {
        return { id: v.payload.doc.id, ...v.payload.doc.data() as any } as Vaccine;
      });
    });
  }

  async saveVaccine() {
    if (this.vaccineForm.invalid) return;
    const values = this.vaccineForm.value;
    const vaccine = new Vaccine();
    vaccine.animalId = this.animal.id;
    vaccine.farmId = this.animal.farmId;
    vaccine.name = values.name;
    vaccine.date = values.date;
    vaccine.notes = values.notes;
    vaccine.administeredBy = values.administeredBy;
    try {
      await this.firebaseService.registerVaccine(vaccine);
      this.vaccineForm.reset();
      this.alert.presentAlert('Sucesso', 'Vacina registrada!');
    } catch (err) {
      console.error(err);
      this.alert.presentAlert('Erro', 'Erro ao registrar vacina');
    } finally {
    }
  }
  
  backPage() {
    window.history.back();
  }

}

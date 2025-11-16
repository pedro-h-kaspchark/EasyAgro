import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feeding } from 'src/app/model/entities/Feeding';
import { FirebaseService } from 'src/app/model/service/firebase.service';
import { loading } from 'src/app/common/loading';
import { Alert } from 'src/app/common/alert';

@Component({
  selector: 'app-feeding-management',
  templateUrl: './feeding-management.page.html',
  styleUrls: ['./feeding-management.page.scss'],
})
export class FeedingManagementPage implements OnInit {
  feedingForm!: FormGroup;
  feeds: Feeding[] = [];
  animal: any;

  constructor(private fb: FormBuilder, private firebaseService: FirebaseService, private load: loading, private alert: Alert) {}

  ngOnInit() {
    this.animal = history.state.animal;
    this.feedingForm = this.fb.group({
      date: ['', Validators.required],
      feedType: ['', Validators.required],
      amount: ['', [Validators.required]],
      notes: ['']
    });
    this.loadFeedings();
  }

  loadFeedings() {
    if (!this.animal) return;
    this.firebaseService.getFeedingsByAnimal(this.animal.id).subscribe(res => {
      this.feeds = res.map(f => ({ id: f.payload.doc.id, ...f.payload.doc.data() as any } as Feeding));
    });
  }

  async saveFeeding() {
    if (this.feedingForm.invalid) return;
    const values = this.feedingForm.value;
    const feeding = new Feeding();
    feeding.animalId = this.animal.id;
    feeding.farmId = this.animal.farmId;
    feeding.date = values.date;
    feeding.feedType = values.feedType;
    feeding.amount = Number(values.amount);
    feeding.notes = values.notes;
    try {
      await this.firebaseService.registerFeeding(feeding);
      this.feedingForm.reset();
      this.alert.presentAlert('Sucesso', 'Registro de alimentação salvo!');
    } catch (err) {
      console.error(err);
      this.alert.presentAlert('Erro', 'Erro ao salvar alimentação');
    } finally {
    }
  }

    backPage() {
    window.history.back();
  }

}

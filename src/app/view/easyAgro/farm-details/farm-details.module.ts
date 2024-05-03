import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FarmDetailsPageRoutingModule } from './farm-details-routing.module';
import { FarmDetailsPage } from './farm-details.page';
import { AnimalCreateFormComponent } from '../components/animal-create-form/animal-create-form.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FarmDetailsPageRoutingModule
  ],
  declarations: [
    FarmDetailsPage,
    AnimalCreateFormComponent
  ]
})
export class FarmDetailsPageModule {}

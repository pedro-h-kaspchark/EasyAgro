import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeathAnimalsPageRoutingModule } from './death-animals-routing.module';

import { DeathAnimalsPage } from './death-animals.page';
import { AnimalViewFormComponent } from '../components/animal-view-form/animal-view-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeathAnimalsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    DeathAnimalsPage,
    AnimalViewFormComponent
  ]
})
export class DeathAnimalsPageModule {}

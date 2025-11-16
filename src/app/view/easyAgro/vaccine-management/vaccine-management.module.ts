import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { VaccineManagementPageRoutingModule } from './vaccine-management-routing.module';
import { VaccineManagementPage } from './vaccine-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VaccineManagementPageRoutingModule
  ],
  declarations: [VaccineManagementPage]
})
export class VaccineManagementPageModule {}

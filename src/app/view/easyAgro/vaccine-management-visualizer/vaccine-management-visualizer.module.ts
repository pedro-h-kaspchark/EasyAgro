import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { VaccineManagementVisualizerPageRoutingModule } from './vaccine-management-visualizer-routing.module';
import { VaccineManagementVisualizerPage } from './vaccine-management-visualizer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VaccineManagementVisualizerPageRoutingModule
  ],
  declarations: [VaccineManagementVisualizerPage]
})
export class VaccineManagementVisualizerPageModule {}

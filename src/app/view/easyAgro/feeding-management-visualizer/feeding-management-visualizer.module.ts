import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FeedingManagementVisualizerPageRoutingModule } from './feeding-management-visualizer-routing.module';
import { FeedingManagementVisualizerPage } from './feeding-management-visualizer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeedingManagementVisualizerPageRoutingModule
  ],
  declarations: [FeedingManagementVisualizerPage]
})
export class FeedingManagementVisualizerPageModule {}


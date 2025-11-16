import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FeedingManagementPageRoutingModule } from './feeding-management-routing.module';
import { FeedingManagementPage } from './feeding-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FeedingManagementPageRoutingModule
  ],
  declarations: [FeedingManagementPage]
})
export class FeedingManagementPageModule {}

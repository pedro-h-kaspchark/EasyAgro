import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LotManagementPageRoutingModule } from './lot-management-routing.module';
import { LotManagementPage } from './lot-management.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LotManagementPageRoutingModule
  ],
  declarations: [LotManagementPage]
})
export class LotManagementPageModule {}

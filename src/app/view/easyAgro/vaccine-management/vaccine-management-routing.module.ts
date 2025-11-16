import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaccineManagementPage } from './vaccine-management.page';

const routes: Routes = [
  {
    path: '',
    component: VaccineManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VaccineManagementPageRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaccineManagementVisualizerPage } from './vaccine-management-visualizer.page';

const routes: Routes = [
  {
    path: '',
    component: VaccineManagementVisualizerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VaccineManagementVisualizerPageRoutingModule {}

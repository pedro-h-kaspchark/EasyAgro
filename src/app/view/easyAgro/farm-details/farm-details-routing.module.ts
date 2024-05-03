import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FarmDetailsPage } from './farm-details.page';

const routes: Routes = [
  {
    path: '',
    component: FarmDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmDetailsPageRoutingModule {}

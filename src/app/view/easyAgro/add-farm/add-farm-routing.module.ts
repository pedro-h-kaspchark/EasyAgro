import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddFarmPage } from './add-farm.page';

const routes: Routes = [
  {
    path: '',
    component: AddFarmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddFarmPageRoutingModule {}

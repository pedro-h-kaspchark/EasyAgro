import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FarmPage } from './farm.page';

const routes: Routes = [
  {
    path: '',
    component: FarmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmPageRoutingModule {}

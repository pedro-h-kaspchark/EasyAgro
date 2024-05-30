import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeathAnimalsPage } from './death-animals.page';

const routes: Routes = [
  {
    path: '',
    component: DeathAnimalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeathAnimalsPageRoutingModule {}

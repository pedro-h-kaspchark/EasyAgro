import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedingManagementPage } from './feeding-management.page';

const routes: Routes = [
  {
    path: '',
    component: FeedingManagementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedingManagementPageRoutingModule {}

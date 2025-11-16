import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedingManagementVisualizerPage } from './feeding-management-visualizer.page';

const routes: Routes = [
  {
    path: '',
    component: FeedingManagementVisualizerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedingManagementVisualizerPageRoutingModule {}

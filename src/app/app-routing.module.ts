import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./view/user/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./view/user/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'recovery-password',
    loadChildren: () => import('./view/user/recovery-password/recovery-password.module').then( m => m.RecoveryPasswordPageModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./view/easyAgro/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'farm',
    loadChildren: () => import('./view/easyAgro/farm/farm.module').then(m => m.FarmPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'farm-details',
    loadChildren: () => import('./view/easyAgro/farm-details/farm-details.module').then(m => m.FarmDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-farm',
    loadChildren: () => import('./view/easyAgro/add-farm/add-farm.module').then(m => m.AddFarmPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'death-animals',
    loadChildren: () => import('./view/easyAgro/death-animals/death-animals.module').then( m => m.DeathAnimalsPageModule),
    canActivate: [AuthGuard]
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

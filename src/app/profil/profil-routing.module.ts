import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilPage } from './profil.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilPage
  },
  {
    path: 'connect-witch-phone-number',
    loadChildren: () => import('./connect-witch-phone-number/connect-witch-phone-number.module').then( m => m.ConnectWitchPhoneNumberPageModule)
  },
  {
    path: 'select-language',
    loadChildren: () => import('./select-language/select-language.module').then( m => m.SelectLanguagePageModule)
  },
  {
    path: 'update-profil',
    loadChildren: () => import('./update-profil/update-profil.module').then( m => m.UpdateProfilPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilPageRoutingModule {}

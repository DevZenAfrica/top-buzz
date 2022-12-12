import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilPageRoutingModule } from './profil-routing.module';

import { ProfilPage } from './profil.page';
import {TranslateModule} from "@ngx-translate/core";
import {HomePageModule} from "../home/home.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfilPageRoutingModule,
        TranslateModule,
        HomePageModule
    ],
  declarations: [ProfilPage]
})
export class ProfilPageModule {}

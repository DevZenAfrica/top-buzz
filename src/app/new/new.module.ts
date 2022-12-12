import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewPageRoutingModule } from './new-routing.module';

import { NewPage } from './new.page';
import {HomePageModule} from "../home/home.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NewPageRoutingModule,
        HomePageModule,
        TranslateModule,
        ReactiveFormsModule
    ],
  declarations: [NewPage]
})
export class NewPageModule {}

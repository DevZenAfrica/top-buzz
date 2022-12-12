import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TopPageRoutingModule } from './top-routing.module';

import { TopPage } from './top.page';
import {HomePageModule} from "../home/home.module";
import {PrintMostViewedComponent} from "../shared/print-most-viewed/print-most-viewed.component";
import {PrintMostCommentedComponent} from "../shared/print-most-commented/print-most-commented.component";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TopPageRoutingModule,
        HomePageModule,
        TranslateModule
    ],
  declarations: [TopPage, PrintMostViewedComponent, PrintMostCommentedComponent]
})
export class TopPageModule {}

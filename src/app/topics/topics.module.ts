import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TopicsPageRoutingModule } from './topics-routing.module';

import { TopicsPage } from './topics.page';
import {HomePageModule} from '../home/home.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TopicsPageRoutingModule,
        HomePageModule,
      TranslateModule
    ],
  declarations: [TopicsPage]
})
export class TopicsPageModule {}

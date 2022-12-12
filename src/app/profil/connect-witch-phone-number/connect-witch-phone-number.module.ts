import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectWitchPhoneNumberPageRoutingModule } from './connect-witch-phone-number-routing.module';

import { ConnectWitchPhoneNumberPage } from './connect-witch-phone-number.page';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ConnectWitchPhoneNumberPageRoutingModule,
        TranslateModule
    ],
  declarations: [ConnectWitchPhoneNumberPage]
})
export class ConnectWitchPhoneNumberPageModule {}

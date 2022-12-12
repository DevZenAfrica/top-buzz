import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ConnectWitchPhoneNumberPage } from './connect-witch-phone-number.page';

describe('ConnectWitchPhoneNumberPage', () => {
  let component: ConnectWitchPhoneNumberPage;
  let fixture: ComponentFixture<ConnectWitchPhoneNumberPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectWitchPhoneNumberPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectWitchPhoneNumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

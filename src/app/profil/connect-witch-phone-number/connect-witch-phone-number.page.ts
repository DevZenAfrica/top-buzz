import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';
import {WindowService} from '../../services/window.service';
import {AuthentificationService} from '../../services/authentification.service';
import {AlertService} from '../../services/alert.service';
import {Utilisateur} from '../../models/utilisateur';
import { Location } from '@angular/common';
import {Router} from '@angular/router';
import {ToolsService} from '../../services/tools.service';

@Component({
  selector: 'app-connect-witch-phone-number',
  templateUrl: './connect-witch-phone-number.page.html',
  styleUrls: ['./connect-witch-phone-number.page.scss'],
})
export class ConnectWitchPhoneNumberPage implements OnInit {

  windowRef: any;
  isAskCode = false;
  numeroPhone: string;
  isLoading = false;

  constructor(private router: Router, private alertService: AlertService, private windowService: WindowService, private authService: AuthentificationService, private location: Location) { }

  //Initiate windowRef from WindowService
  async ionViewWillEnter() {
    this.windowRef = await this.windowService.windowRef;
    this.windowRef.recaptchaVerifier = await new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible'
    });
    await this.windowRef.recaptchaVerifier.render();
  }

  sendLoginCode(form){
    this.isLoading = true;
    this.authService.numberAuth('+' + form.value.countryCode.toString() + form.value.phone.toString(), this.windowRef).then(
      (data) => {
        this.isLoading = false;
        this.numeroPhone = form.value.phone.toString();
        this.windowRef.confirmationResult = data;
        this.isAskCode = true;
      }, (error) => {
        this.alertService.print(error);
        this.isLoading = false;
        this.windowRef.recaptchaVerifier.render().then(function(widgetId) {
          this.windowRef.reset(widgetId);
        });
      }
    );
  }

  submitVerif(form) {
    this.isLoading = true;
    this.windowRef.confirmationResult.confirm(form.value.verifCode.toString())
      .then(
        (result) => {
          localStorage.setItem('id', result.user.phoneNumber);
          this.authService.isRegister(result.user.phoneNumber).then(
            (data) => {
              if(data) {
                this.router.navigateByUrl('tabs/home');
              } else {
                const gid = new ToolsService();
                const tmpUser = new Utilisateur('user-' + gid.generateId(4).toString(), result.user.phoneNumber, '', 1, '0000', 'phone');
                this.authService.saveToDataBase(tmpUser).then(
                  () => {
                    this.router.navigateByUrl('tabs/home');
                  }, (error) => {
                    this.alertService.print(error);
                  }
                );
              }
            }
          );
        }, (error) => {
          this.isLoading = false;
          this.alertService.print(error);
        });
  }

  ngOnInit() {
  }
}

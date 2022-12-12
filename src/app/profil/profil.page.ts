import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthentificationService } from '../services/authentification.service';
import {UtilisateurService} from '../services/utilisateur.service';
import {AlertService} from '../services/alert.service';
import {Utilisateur} from '../models/utilisateur';
import {environment} from '../../environments/environment';

declare function getMsisdn(): any;
declare function getCountry(): any;
declare const globalUserName: any;
declare const avatarUser: any;

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {

  isLoading = true;
  user: Utilisateur | any = null;
  environment = environment;

  constructor(private alertService: AlertService, private userService: UtilisateurService, private alertController: AlertController, private authService: AuthentificationService) { }

  ngOnInit() {
    this.authService.isAuthenticated().then(
      (result) => {
        if(result) {
          this.userService.getCurrentUtilisateur().then(
            (data) => {
              this.user = data;
              if(this.user.typeInscription === 'ayoba') { this.user.photo = avatarUser; }
              this.isLoading = false;
            }
          );
        } else { this.isLoading = false; }
      }
    );
  }

  lrgoogle() {
    this.isLoading = true;
    this.authService.googleAuth().then(
      () => {
        location.reload();
      },
      (error) => {
        this.isLoading = false;
        this.alertService.print(error);
      }
    );
  }

  async confirmDeconnexion() {

    const alert = await this.alertController.create({
      header: 'You are about to get disconnected',
      message: 'Do you really want to close this session ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'OK',
          handler: () => {
            this.authService.signOut().then();
            localStorage.clear();
            location.reload();
          }
        }
      ]
    });
    await alert.present();
  }

}
